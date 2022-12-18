import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../persistence/entities/user.entity';
import { UserToSpace } from '../../persistence/entities/user-to-space.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserToSpace])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
