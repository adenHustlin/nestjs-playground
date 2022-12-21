import { applyDecorators, SetMetadata } from '@nestjs/common';
import { SpaceRoleSet } from '../constatns';

export const Role = (entity, ...roles: SpaceRoleSet[]) => {
  return applyDecorators(
    SetMetadata('entity', entity),
    SetMetadata('roles', roles),
  );
};
