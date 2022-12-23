import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from '../../persistence/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../../persistence/entities/post.entity';
import { Connection, In, Repository } from 'typeorm';
import { UserToSpace } from '../../persistence/entities/user-to-space.entity';
import { PostStatus, PostType, SpaceRoleSet } from '../../common/constatns';
import { paginationOptions } from '../../common/function/common.functions';
import { Space } from '../../persistence/entities/space.entity';
import { PostView } from '../../persistence/entities/post-view.entity';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostFile } from '../../persistence/entities/post-file.entity';
import { Chat } from '../../persistence/entities/chat.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(PostFile)
    private readonly postFileRepository: Repository<PostFile>,
    @InjectRepository(UserToSpace)
    private readonly userToSpaceRepository: Repository<UserToSpace>,
    @InjectRepository(Space)
    private readonly spaceRepository: Repository<Space>,
    @InjectRepository(PostView)
    private readonly postViewRepository: Repository<PostView>,
    private readonly connection: Connection,
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
      relations: ['SpaceRole', 'Space'],
    });
    if (!userToSpace)
      throw new BadRequestException('invalid user for given spaceId');

    this.validatePostPolicy(
      userToSpace.roleSet,
      createPostDto.postType,
      createPostDto.anonymous,
    );

    return await this.postRepository.save({
      ...createPostDto,
      UserToSpace: userToSpace,
      Space: userToSpace.Space,
      Files: files.map(({ path }) => ({ path })),
    });
  }

  validatePostPolicy(
    roleSet: SpaceRoleSet,
    postType: PostType,
    anonymous: boolean,
  ) {
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
        if (roleSet !== SpaceRoleSet.PARTICIPANT && anonymous)
          throw new BadRequestException(
            'creator or admin can not be anonymous',
          );
        break;
    }
  }

  async findAll(user: User, query) {
    const { page, pageSize, spaceId } = query;

    const userToSpace = await this.userToSpaceRepository.findOne({
      where: { User: user, Space: spaceId },
    });
    if (!userToSpace) throw new UnauthorizedException('invalid user');

    const posts = await this.postRepository.find({
      where: { Space: spaceId },
      ...paginationOptions(page, pageSize),
      relations: ['UserToSpace', 'UserToSpace.User', 'Chats'],
      order: { createdAt: 'ASC' },
    });
    const result = [];
    for (const post of posts) {
      const filteredPost = this.excludeUserForAnonymous(post, userToSpace);
      const postView = await this.postViewRepository.findOne({
        where: { Post: post, UserToSpace: userToSpace },
      });
      filteredPost['postStatus'] = this.postStatus(post, postView);
      delete filteredPost.Chats;
      result.push(filteredPost);
    }

    return result;
  }

  postStatus(post: Post, postView: PostView) {
    // 읽은시간이 없을떄
    if (!postView) return PostStatus.NEW;
    // 글업데이트가 읽고나서 일어남
    if (postView.readTime < post.updatedAt) return PostStatus.UPDATED;
    // 마지막댓글이 읽고나서 달림
    if (postView.readTime < post?.Chats[post.Chats.length - 1]?.createdAt)
      return PostStatus.NEWCHAT;
    return '';
  }

  async remove(user: User, id: number) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['Space', 'Chats', 'Files', 'UserToSpace', 'UserToSpace.User'],
    });
    if (!post) throw new BadRequestException('invalid postId');

    const userToSpace = await this.userToSpaceRepository.findOne({
      where: {
        User: user,
        roleSet: In([SpaceRoleSet.CREATOR, SpaceRoleSet.ADMIN]),
        Space: post.Space,
      },
    });

    if (post.UserToSpace.User.id !== user.id && !userToSpace)
      throw new UnauthorizedException(
        'user must be either writer or authorized user',
      );

    return await this.postRepository.softRemove(post);
  }

  async findOne(user, id: number) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: [
        'Space',
        'Files',
        'Chats',
        'UserToSpace',
        'Chats.UserToSpace',
        'Chats.ParentChat',
        'Chats.ParentChat.UserToSpace',
      ],
    });
    if (!post) throw new BadRequestException('invalid postId');

    const userToSpace = await this.userToSpaceRepository.findOne({
      where: { User: user, Space: post.Space },
    });
    if (!userToSpace) throw new UnauthorizedException('invalid user');

    const postView = await this.postViewRepository.findOne({
      where: { Post: post, UserToSpace: userToSpace },
    });

    const result = [];
    for (const chat of post.Chats) {
      const filteredChat = this.excludeUserForAnonymous(chat, userToSpace);
      if (filteredChat.ParentChat) {
        filteredChat.ParentChat = this.excludeUserForAnonymous(
          filteredChat.ParentChat,
          userToSpace,
        );
      }
      result.push(filteredChat);
    }
    post.Chats = result;

    postView
      ? await this.postViewRepository.update(
          { id: postView.id },
          { Post: post, UserToSpace: userToSpace },
        )
      : await this.postViewRepository.save({
          Post: post,
          UserToSpace: userToSpace,
        });
    return post;
  }

  excludeUserForAnonymous(entity: Chat | Post, userToSpace: UserToSpace) {
    let result;
    if (entity.anonymous) {
      if (
        // 조회자 권한이 생성자나 관리자이거나
        userToSpace.roleSet !== SpaceRoleSet.PARTICIPANT ||
        // 조회자가 작성자일떄
        userToSpace.id === entity.UserToSpace.id
      ) {
        result = entity;
      } else {
        // 조회자가 참여자이고 작성자도아닐때
        delete entity.UserToSpace;
        result = entity;
      }
    } else {
      // 익명글이 아닐때
      result = entity;
    }

    return result;
  }

  async update(
    user: User,
    files: Array<Express.Multer.File>,
    id: number,
    updatePostDto: UpdatePostDto,
  ) {
    // 작성자만 수정가능
    const post = await this.postRepository.findOne({
      where: {
        id,
        UserToSpace: { User: user },
      },
      relations: ['UserToSpace', 'Files'],
    });
    if (!post) throw new BadRequestException('invalid User');

    this.validatePostPolicy(
      post.UserToSpace.roleSet,
      updatePostDto.postType,
      updatePostDto.anonymous,
    );
    const postEnt = this.postRepository.create({
      ...updatePostDto,
    });
    return this.connection.transaction(async (entityManager) => {
      if (post.Files.length > 0)
        await entityManager.softDelete(
          PostFile,
          post.Files.map((file) => file.id),
        );
      await entityManager.save(
        PostFile,
        files.map(({ path }) => ({ path, Post: post })),
      );

      return await entityManager.update(Post, { id }, postEnt);
    });
  }
}
