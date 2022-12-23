import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SpaceRole } from '../../persistence/entities/space-role.entity';
import { Connection, Repository } from 'typeorm';
import { Space } from '../../persistence/entities/space.entity';
import { SpaceRoleSet } from '../../common/constatns';
import { UpdateSpaceRoleDto } from './dto/update-space-role.dto';
import { User } from '../../persistence/entities/user.entity';
import { UserToSpace } from '../../persistence/entities/user-to-space.entity';

@Injectable()
export class SpaceRoleService {
  constructor(
    @InjectRepository(SpaceRole)
    private readonly spaceRoleRepository: Repository<SpaceRole>,
    @InjectRepository(Space)
    private readonly spaceRepository: Repository<Space>,
    @InjectRepository(UserToSpace)
    private readonly userToSpaceRepository: Repository<UserToSpace>,
    private readonly connection: Connection,
  ) {}

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

  async update(user: User, id: number, body: UpdateSpaceRoleDto) {
    const space = await this.spaceRepository.findOne({
      where: { id },
      relations: ['SpaceRoles'],
    });
    if (!space) throw new BadRequestException('invalid space Id');

    const result = await this.connection.transaction(async (entityManager) => {
      if (space.SpaceRoles.length > 0) {
        await entityManager.softDelete(
          SpaceRole,
          space.SpaceRoles.map((role) => role.id),
        );
      }
      return await entityManager.insert(
        SpaceRole,
        body.SpaceRoles.map((spaceRole) => ({ ...spaceRole, Space: space })),
      );
    });
    return result;
  }
}
