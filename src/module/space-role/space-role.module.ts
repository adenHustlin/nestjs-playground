import { Module } from '@nestjs/common';
import { SpaceRoleService } from './space-role.service';
import { SpaceRoleController } from './space-role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpaceRole } from '../../persistence/entities/space-role.entity';
import { Space } from '../../persistence/entities/space.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SpaceRole, Space])],
  controllers: [SpaceRoleController],
  providers: [SpaceRoleService],
})
export class SpaceRoleModule {}
