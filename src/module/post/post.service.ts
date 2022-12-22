import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '../../persistence/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../../persistence/entities/post.entity';
import { Repository } from 'typeorm';
import { UserToSpace } from '../../persistence/entities/user-to-space.entity';
import { PostType, SpaceRoleSet } from '../../common/constatns';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(UserToSpace)
    private readonly userToSpaceRepository: Repository<UserToSpace>,
  ) {}

  async create(
    user: User,
    createPostDto: CreatePostDto,
    files: Array<Express.Multer.File>,
  ) {
    const userToSpace = await this.userToSpaceRepository.findOne({
      where: {
        User: user,
        Space: createPostDto.spaceId,
      },
      relations: ['SpaceRole'],
    });
    if (!userToSpace)
      throw new BadRequestException('invalid user for given spaceId');

    this.validatePost(
      userToSpace.roleSet,
      createPostDto.postType,
      createPostDto.anonymous,
    );

    return await this.postRepository.save({
      ...createPostDto,
      UserToSpace: userToSpace,
      Files: files.map(({ path }) => ({ path })),
    });
  }

  validatePost(roleSet: SpaceRoleSet, postType: PostType, anonymous: boolean) {
    switch (postType) {
      case PostType.NOTICE:
        if (roleSet === SpaceRoleSet.PARTICIPANT)
          throw new UnauthorizedException(
            'creator or admin authority required',
          );
        if (anonymous)
          throw new BadRequestException('notice post can not be anonymous');
        break;
      case PostType.QUESTION:
        if (roleSet !== SpaceRoleSet.PARTICIPANT)
          throw new UnauthorizedException('participant authority required');
        break;
    }
  }

  findAll() {
    return `This action returns all post`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
