import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostView } from '../../persistence/entities/post-view.entity';
import { Post } from '../../persistence/entities/post.entity';
import { PostFile } from '../../persistence/entities/post-file.entity';
import { UserToSpace } from '../../persistence/entities/user-to-space.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostView, Post, PostFile, UserToSpace])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
