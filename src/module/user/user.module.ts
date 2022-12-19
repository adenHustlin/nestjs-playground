import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserToSpace } from '../../persistence/entities/user-to-space.entity';
import { AuthModule } from '../auth/auth.module';
import { User } from '../../persistence/entities/user.entity';
import { UserRepository } from '../../persistence/repositories/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserToSpace]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
