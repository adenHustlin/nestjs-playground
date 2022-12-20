import { Injectable } from '@nestjs/common';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Space } from '../../persistence/entities/space.entity';
import { Repository } from 'typeorm';
import { User } from '../../persistence/entities/user.entity';
import { UserToSpace } from '../../persistence/entities/user-to-space.entity';
import { SpaceRole } from '../../persistence/entities/space-role.entity';

@Injectable()
export class SpaceService {
  constructor(
    @InjectRepository(Space)
    private readonly spaceRepository: Repository<Space>,
    @InjectRepository(UserToSpace)
    private readonly userToSpaceRepository: Repository<UserToSpace>,
    @InjectRepository(SpaceRole)
    private readonly spaceRoleRepository: Repository<SpaceRole>,
  ) {}

  async create(user: User, createSpaceDto: CreateSpaceDto) {
    const spaceObj = this.spaceRepository.create({
      ...createSpaceDto,
      creator: user,
    });
    const result = await this.spaceRepository.save(spaceObj);

    return result.id;
  }

  findAll() {
    return `This action returns all space`;
  }

  findOne(id: number) {
    return `This action returns a #${id} space`;
  }

  update(id: number, updateSpaceDto: UpdateSpaceDto) {
    return `This action updates a #${id} space`;
  }

  remove(id: number) {
    return `This action removes a #${id} space`;
  }
}
