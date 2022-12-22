import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateSpaceDto } from './dto/create-space.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Space } from '../../persistence/entities/space.entity';
import { Connection, Repository } from 'typeorm';
import { User } from '../../persistence/entities/user.entity';
import { UserToSpace } from '../../persistence/entities/user-to-space.entity';
import { SpaceRole } from '../../persistence/entities/space-role.entity';
import { SpaceCodeGenerator } from '../../common/function/common.functions';
import { SpaceRoleSet } from '../../common/constatns';
import { JoinSpaceDto } from './dto/join-space.dto';

@Injectable()
export class SpaceService {
  constructor(
    @InjectRepository(Space)
    private readonly spaceRepository: Repository<Space>,
    @InjectRepository(UserToSpace)
    private readonly userToSpaceRepository: Repository<UserToSpace>,
    @InjectRepository(SpaceRole)
    private readonly spaceRoleRepository: Repository<SpaceRole>,
    private connection: Connection,
  ) {}

  async create(
    user: User,
    createSpaceDto: CreateSpaceDto,
    logoImg: Express.Multer.File,
  ) {
    let adminCode = SpaceCodeGenerator(8);
    let participantCode = SpaceCodeGenerator(8);
    let space = await this.spaceRepository.findOne({
      where: [{ adminCode }, { participantCode }],
    });
    while (space) {
      adminCode = SpaceCodeGenerator(8);
      participantCode = SpaceCodeGenerator(8);
      space = await this.spaceRepository.findOne({
        where: [{ adminCode }, { participantCode }],
      });
    }

    const spaceEnt = this.spaceRepository.create({
      ...createSpaceDto,
      logoImg: logoImg?.path,
      adminCode,
      participantCode,
    });

    const savedSpace = await this.connection.transaction(async (manager) => {
      const savedSpace = await manager.save<Space>(spaceEnt);
      const userToSpaceEnt = this.userToSpaceRepository.create({
        User: user,
        Space: savedSpace,
        SpaceRole: savedSpace.SpaceRoles.find(
          (role) => role.roleName === createSpaceDto.creatorRoleName,
        ),
        roleSet: SpaceRoleSet.CREATOR,
      });
      const savedUserToSpace = await manager.save<UserToSpace>(userToSpaceEnt);
      savedSpace.UserToSpaces = [savedUserToSpace];
      return savedSpace;
    });

    return savedSpace.id;
  }

  async join(user: User, code: string, body: JoinSpaceDto) {
    const { roleName, roleSet } = body;

    const space = await this.spaceRepository.findOne({
      where: [{ adminCode: code }, { participantCode: code }],
      relations: ['SpaceRoles', 'UserToSpaces', 'UserToSpaces.User'],
    });
    if (!space) throw new BadRequestException('invalid space code');
    if (space.UserToSpaces.find((uts) => uts.User.id === user.id))
      throw new ConflictException('user already belongs to associated space');

    let spaceRole;
    switch (code) {
      case space.adminCode:
        spaceRole = space.SpaceRoles.filter(
          (role) => role.roleSet === SpaceRoleSet.ADMIN,
        ).find(
          (role) => role.roleName === roleName && role.roleSet === roleSet,
        );
        break;
      case space.participantCode:
        spaceRole = space.SpaceRoles.filter(
          (role) => role.roleSet === SpaceRoleSet.PARTICIPANT,
        ).find(
          (role) => role.roleName === roleName && role.roleSet === roleSet,
        );
        break;
    }
    if (!spaceRole) throw new BadRequestException('invalid space-role info');

    const userToSpaceEnt = this.userToSpaceRepository.create({
      User: user,
      Space: space,
      SpaceRole: spaceRole,
      roleSet: roleSet,
    });
    const savedUserToSpace = await this.userToSpaceRepository.save(
      userToSpaceEnt,
    );

    return savedUserToSpace.id;
  }

  async remove(id: number) {
    return await this.spaceRepository.softRemove(
      await this.spaceRepository.findOne({
        where: { id },
        relations: ['SpaceRoles', 'UserToSpaces', 'Posts'],
      }),
    );
  }

  async findOne(user, id: number) {
    return await this.spaceRepository.findOne({
      where: { id },
      relations: ['SpaceRoles', 'UserToSpaces', 'Posts'],
    });
  }
}
