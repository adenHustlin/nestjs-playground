import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { SpaceRoleService } from './space-role.service';
import { Auth } from '../../common/decorator/auth.decorator';
import { Role } from '../../common/decorator/role.decorator';
import { UserToSpace } from '../../persistence/entities/user-to-space.entity';
import { SpaceRoleSet } from '../../common/constatns';
import { User } from '../../common/decorator/user.decorator';
import { UpdateSpaceRoleDto } from './dto/update-space-role.dto';

@Controller('space-role')
export class SpaceRoleController {
  constructor(private readonly spaceRoleService: SpaceRoleService) {}

  @Auth()
  @Get(':code')
  findAssociatedRoles(@Param('code') code: string) {
    return this.spaceRoleService.findAllWithSpaceCode(code);
  }

  @Auth()
  @Role(UserToSpace, [SpaceRoleSet.CREATOR, SpaceRoleSet.ADMIN], 'id')
  @Put(':id')
  update(
    @User() user,
    @Param('id') id: number,
    @Body() body: UpdateSpaceRoleDto,
  ) {
    return this.spaceRoleService.update(user, +id, body);
  }
}
