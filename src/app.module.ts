import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SpaceModule } from './module/space/space.module';
import { SpaceRoleModule } from './module/space-role/space-role.module';
import { PostModule } from './module/post/post.module';
import { ChatModule } from './module/chat/chat.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormConfig } from './config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './module/auth/auth.module';
import { DotenvValidation } from './config/dotenv-validation.config';
import { UserModule } from './module/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      // envFilePath: `.${process.env.NODE_ENV}.env`,
      validationSchema: DotenvValidation,
    }),
    TypeOrmModule.forRoot(TypeormConfig),
    SpaceModule,
    SpaceRoleModule,
    PostModule,
    ChatModule,
    UserModule,
    AuthModule,
    // GuardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
