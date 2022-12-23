import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { SpaceRoleService } from './space-role.service';
import { Auth } from '../../common/decorator/auth.decorator';
import { User } from '../../common/decorator/user.decorator';
import { UpdateSpaceRoleDto } from './dto/update-space-role.dto';
import { SpaceRole } from '../../common/decorator/space-role.decorator';
import { SpaceRoleSet } from '../../common/constatns';

@Controller('space-role')
export class SpaceRoleController {
  constructor(private readonly spaceRoleService: SpaceRoleService) {}

  @Auth()
  @Get(':code')
  findAssociatedRoles(@Param('code') code: string) {
    return this.spaceRoleService.findAllWithSpaceCode(code);
  }

  @SpaceRole([SpaceRoleSet.CREATOR, SpaceRoleSet.ADMIN], 'spaceId')
  @Auth()
  @Put(':spaceId')
  update(
    @User() user,
    @Param() spaceId: number,
    @Body() body: UpdateSpaceRoleDto,
  ) {
    return this.spaceRoleService.update(user, spaceId, body);
  }
}
