import {
  CanActivate,
  ExecutionContext,
  mixin,
  Type,
  UnauthorizedException,
} from '@nestjs/common';
import { SpaceRoleSet } from '../constatns';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UserToSpace } from '../../persistence/entities/user-to-space.entity';

export const SpaceRoleGuard = (
  roles: SpaceRoleSet[],
  property: string,
): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    constructor(
      @InjectRepository(UserToSpace)
      private readonly userToSpaceRepository: Repository<UserToSpace>,
    ) {}

    async canActivate(context: ExecutionContext) {
      const { user, params } = context.switchToHttp().getRequest();

      const userToSpace: UserToSpace = await this.userToSpaceRepository.findOne(
        {
          where: {
            Space: params[property],
            roleSet: In(roles),
            User: user,
          },
        },
      );
      if (!userToSpace)
        throw new UnauthorizedException(`${roles} authority required`);
      return true;
    }
  }

  return mixin(RoleGuardMixin);
};
