import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SpaceRoleService } from './space-role.service';
import { CreateSpaceRoleDto } from './dto/create-space-role.dto';
import { UpdateSpaceRoleDto } from './dto/update-space-role.dto';

@Controller('space-role')
export class SpaceRoleController {
  constructor(private readonly spaceRoleService: SpaceRoleService) {}

  @Post()
  create(@Body() createSpaceRoleDto: CreateSpaceRoleDto) {
    return this.spaceRoleService.create(createSpaceRoleDto);
  }

  @Get()
  findAll() {
    return this.spaceRoleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.spaceRoleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSpaceRoleDto: UpdateSpaceRoleDto) {
    return this.spaceRoleService.update(+id, updateSpaceRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.spaceRoleService.remove(+id);
  }
}
