import { applyDecorators, UseGuards } from '@nestjs/common';
import { SpaceRoleSet } from '../constatns';
import { RoleGuard } from '../guards/role.guard';
import { AuthGuard } from '@nestjs/passport';

export const Role = (entity, roles: SpaceRoleSet[]) =>
  applyDecorators(
    UseGuards(AuthGuard('jwt')),
    UseGuards(RoleGuard(entity, roles)),
  );
