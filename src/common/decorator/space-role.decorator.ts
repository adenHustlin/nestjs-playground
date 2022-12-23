import { applyDecorators, UseGuards } from '@nestjs/common';
import { SpaceRoleSet } from '../constatns';
import { SpaceRoleGuard } from '../guards/role.guard';

export const SpaceRole = (roles: SpaceRoleSet[], property = 'id') =>
  applyDecorators(UseGuards(SpaceRoleGuard(roles, property)));
