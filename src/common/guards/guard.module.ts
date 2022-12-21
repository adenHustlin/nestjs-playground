import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Space } from '../../persistence/entities/space.entity';
import { SpaceRole } from '../../persistence/entities/space-role.entity';
import { RolesGuard } from './role.guard';
import { Chat } from '../../persistence/entities/chat.entity';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [TypeOrmModule.forFeature([Space, SpaceRole, Chat])],
  providers: [{ provide: APP_GUARD, useClass: RolesGuard }],
})
export class GuardModule {}
