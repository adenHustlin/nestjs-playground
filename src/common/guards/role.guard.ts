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

export const RoleGuard = (
  entity,
  roles: SpaceRoleSet[],
  spaceIdProperty: string,
): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    constructor(
      @InjectRepository(entity)
      private readonly repo: Repository<typeof entity>,
    ) {}

    async canActivate(context: ExecutionContext) {
      const { user, params } = context.switchToHttp().getRequest();
      switch (entity) {
        case UserToSpace:
          const userToSpace: UserToSpace = await this.repo.findOne({
            where: {
              Space: params[spaceIdProperty],
              roleSet: In(roles),
              User: user,
            },
          });
          if (!userToSpace)
            throw new UnauthorizedException(`${roles} authority required`);
          return true;
        default:
          return false;
      }
    }
  }

  return mixin(RoleGuardMixin);
};
