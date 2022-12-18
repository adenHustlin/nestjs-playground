import { Module } from '@nestjs/common';
import { SpaceService } from './space.service';
import { SpaceController } from './space.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Space } from '../../persistence/entities/space.entity';
import { UserToSpace } from '../../persistence/entities/user-to-space.entity';
import { SpaceRole } from '../../persistence/entities/space-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Space, UserToSpace, SpaceRole])],
  controllers: [SpaceController],
  providers: [SpaceService],
})
export class SpaceModule {}
