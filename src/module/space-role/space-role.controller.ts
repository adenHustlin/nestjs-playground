import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { SpaceRoleService } from './space-role.service';
import { Auth } from '../../common/decorator/auth.decorator';
import { User } from '../../common/decorator/user.decorator';
import { CreateSpaceRoleDto } from './dto/create-space-role.dto';

@Controller('space-role')
export class SpaceRoleController {
  constructor(private readonly spaceRoleService: SpaceRoleService) {}

  @Auth()
  @Get(':code')
  findAssociatedRoles(@Param('code') code: string) {
    return this.spaceRoleService.findAllWithSpaceCode(code);
  }

  @Auth()
  @Post()
  update(@User() user, @Body() body: CreateSpaceRoleDto) {
    return this.spaceRoleService.create(user, body);
  }

  @Auth()
  @Delete(':id')
  delete(@User() user, @Param('id') id: number) {
    return this.spaceRoleService.delete(user, +id);
  }
}
