import { Injectable } from '@nestjs/common';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Space } from '../../persistence/entities/space.entity';
import { Connection, Repository } from 'typeorm';
import { User } from '../../persistence/entities/user.entity';
import { UserToSpace } from '../../persistence/entities/user-to-space.entity';
import { SpaceRole } from '../../persistence/entities/space-role.entity';
import { SpaceCodeGenerator } from '../../common/function/common.functions';

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
    { path: logoImg }: Express.Multer.File,
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
      creator: user,
      logoImg,
      adminCode,
      participantCode,
    });

    const savedSpace = await this.connection.transaction(async (manager) => {
      const savedSpace = await manager.save<Space>(spaceEnt);
      const userToSpaceEnt = this.userToSpaceRepository.create({
        User: user,
        Space: savedSpace,
        spaceRole: savedSpace.SpaceRoles.find(
          (role) => role.roleName === createSpaceDto.creatorRoleName,
        ),
      });
      const savedUserToSpace = await manager.save<UserToSpace>(userToSpaceEnt);
      savedSpace.UserToSpaces = [savedUserToSpace];
      return savedSpace;
    });

    return savedSpace.id;
  }

  async join(user: User, code: string) {
    const space = await this.spaceRepository.findOne({
      where: [{ adminCode: code }, { participantCode: code }],
    });
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
