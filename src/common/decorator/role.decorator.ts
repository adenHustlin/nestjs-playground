import { applyDecorators, UseGuards } from '@nestjs/common';
import { SpaceRoleSet } from '../constatns';
import { RoleGuard } from '../guards/role.guard';

export const Role = (entity, roles: SpaceRoleSet[], spaceIdProperty: string) =>
  applyDecorators(UseGuards(RoleGuard(entity, roles, spaceIdProperty)));
//요청한 유저가 param으로 보낸 space의 무슨권한인지
