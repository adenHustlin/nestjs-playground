import { Injectable } from '@nestjs/common';
import { CreateSpaceRoleDto } from './dto/create-space-role.dto';
import { UpdateSpaceRoleDto } from './dto/update-space-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SpaceRole } from '../../persistence/entities/space-role.entity';
import { Repository } from 'typeorm';
import { Space } from '../../persistence/entities/space.entity';
import { SpaceRoleSet } from '../../common/constatns';

@Injectable()
export class SpaceRoleService {
  constructor(
    @InjectRepository(SpaceRole)
    private readonly spaceRoleRepository: Repository<SpaceRole>,
    @InjectRepository(Space)
    private readonly spaceRepository: Repository<Space>,
  ) {}

  create(createSpaceRoleDto: CreateSpaceRoleDto) {
    return 'This action adds a new spaceRole';
  }

  findAll() {
    return `This action returns all spaceRole`;
  }

  findOne(id: number) {
    return `This action returns a #${id} spaceRole`;
  }

  update(id: number, updateSpaceRoleDto: UpdateSpaceRoleDto) {
    return `This action updates a #${id} spaceRole`;
  }

  remove(id: number) {
    return `This action removes a #${id} spaceRole`;
  }

  async findAllWithSpaceCode(code: string) {
    const space = await this.spaceRepository.findOne({
      where: [{ adminCode: code }, { participantCode: code }],
      relations: ['SpaceRoles'],
    });
    switch (code) {
      case space.adminCode:
        return space.SpaceRoles.filter(
          (role) => role.roleSet === SpaceRoleSet.ADMIN,
        );
      case space.participantCode:
        return space.SpaceRoles.filter(
          (role) => role.roleSet === SpaceRoleSet.PARTICIPANT,
        );
    }
  }
}
