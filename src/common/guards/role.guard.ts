import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from '../../persistence/entities/chat.entity';
import { Space } from '../../persistence/entities/space.entity';
import { SpaceRoleSet } from '../constatns';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(Space)
    private readonly spaceRepository: Repository<Space>,
    @InjectRepository(Chat) private readonly chatRepository: Repository<Chat>,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<SpaceRoleSet[]>(
      'roles',
      context.getHandler(),
    );
    const entity = this.reflector.get('entity', context.getHandler());
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!roles || !entity || !user) {
      return false;
    }

    return false;
    // return matchRoles(roles, user.roles);
  }
}
