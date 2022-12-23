import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from '../../persistence/entities/chat.entity';
import { In, Repository } from 'typeorm';
import { UserToSpace } from '../../persistence/entities/user-to-space.entity';
import { User } from '../../persistence/entities/user.entity';
import { Post } from '../../persistence/entities/post.entity';
import { SpaceRoleSet } from '../../common/constatns';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private readonly chatRepository: Repository<Chat>,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(UserToSpace)
    private readonly userToSpaceRepository: Repository<UserToSpace>,
  ) {}

  async create(user: User, createChatDto: CreateChatDto) {
    const post = await this.postRepository.findOne({
      where: { id: createChatDto.postId },
      relations: ['Space'],
    });
    if (!post) throw new BadRequestException('invalid PostId');

    const userToSpace = await this.userToSpaceRepository.findOne({
      where: { User: user, Space: post.Space },
    });
    if (!userToSpace) throw new BadRequestException('invalid User');

    if (
      userToSpace.roleSet !== SpaceRoleSet.PARTICIPANT &&
      createChatDto.anonymous
    )
      throw new BadRequestException('anonymous not allowed for admin, creator');

    if (createChatDto.parentChatId) {
      const parentChat = await this.chatRepository.findOne({
        where: { id: createChatDto.parentChatId },
      });
      if (!parentChat) throw new BadRequestException('invalid parentChat Id');
      createChatDto['ParentChat'] = parentChat;
    }

    return await this.chatRepository.save({
      ...createChatDto,
      UserToSpace: userToSpace,
      Post: post,
    });
  }

  async remove(user: User, id: number) {
    const chat = await this.chatRepository.findOne({
      where: { id },
      relations: ['Post', 'Post.Space', 'UserToSpace', 'UserToSpace.User'],
    });
    if (!chat) throw new BadRequestException('invalid chat Id');

    const userToSpace = await this.userToSpaceRepository.findOne({
      where: {
        User: user,
        roleSet: In([SpaceRoleSet.ADMIN, SpaceRoleSet.CREATOR]),
        Space: chat.Post.Space,
      },
    });
    if (chat.UserToSpace.User !== user && !userToSpace)
      throw new UnauthorizedException(
        'user must be either writer or authorized user',
      );

    return await this.chatRepository.softRemove(chat);
  }
}
