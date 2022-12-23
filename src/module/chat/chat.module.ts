import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from '../../persistence/entities/chat.entity';
import { Post } from '../../persistence/entities/post.entity';
import { UserToSpace } from '../../persistence/entities/user-to-space.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, Post, UserToSpace])],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
