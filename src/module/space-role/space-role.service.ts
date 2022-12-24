import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SpaceRole } from '../../persistence/entities/space-role.entity';
import { Connection, In, Repository } from 'typeorm';
import { Space } from '../../persistence/entities/space.entity';
import { SpaceRoleSet } from '../../common/constatns';
import { User } from '../../persistence/entities/user.entity';
import { UserToSpace } from '../../persistence/entities/user-to-space.entity';
import { CreateSpaceRoleDto } from './dto/create-space-role.dto';

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
    if (!space) throw new BadRequestException('invalid space code');
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

  async create(user: User, body: CreateSpaceRoleDto) {
    const space = await this.spaceRepository.findOne({
      where: { id: body.spaceId },
      relations: ['SpaceRoles'],
    });
    if (!space) throw new BadRequestException('invalid space Id');

    const userToSpace = await this.userToSpaceRepository.findOne({
      where: {
        Space: space,
        User: user,
        roleSet: In([SpaceRoleSet.CREATOR, SpaceRoleSet.ADMIN]),
      },
    });
    if (!userToSpace)
      throw new UnauthorizedException('creator or admin authority required');

    return await this.spaceRoleRepository.save({ ...body, Space: space });
  }

  async delete(user: User, id: number) {
    const spaceRole = await this.spaceRoleRepository.findOne({
      where: { id },
      relations: ['Space'],
    });
    if (!spaceRole) throw new BadRequestException('invalid space role id');

    const userToSpace = await this.userToSpaceRepository.findOne({
      where: {
        Space: spaceRole.Space,
        User: user,
        roleSet: In([SpaceRoleSet.CREATOR, SpaceRoleSet.ADMIN]),
      },
    });
    if (!userToSpace)
      throw new UnauthorizedException('creator or admin authority required');

    const spaceRoleInUse = await this.userToSpaceRepository.findOne({
      where: { SpaceRole: spaceRole },
    });
    if (spaceRoleInUse) throw new BadRequestException('space role in use');

    return await this.spaceRoleRepository.softDelete({ id });
  }
}
