import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { SpaceModule } from './space/space.module';
import { SpaceRoleModule } from './space-role/space-role.module';
import { PostModule } from './post/post.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [UserModule, SpaceModule, SpaceRoleModule, PostModule, ChatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
