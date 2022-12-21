import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { SpaceService } from './space.service';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterConfig } from '../../config/multer.config';
import { Auth } from '../../common/decorator/auth.decorator';
import { CreateSpaceDto } from './dto/create-space.dto';
import { User } from '../../common/decorator/user.decorator';
import { CreateSpaceRoleDto } from '../space-role/dto/create-space-role.dto';
import { Role } from '../../common/decorator/role.decorator';
import { Space } from '../../persistence/entities/space.entity';
import { SpaceRoleSet } from '../../common/constatns';

@Controller('space')
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}

  @Auth()
  @Post()
  @UseInterceptors(FileInterceptor('logoImg', MulterConfig('spaceLogoImg')))
  create(
    @User() user,
    @UploadedFile() logoImg: Express.Multer.File,
    @Body() createSpaceDto: CreateSpaceDto,
  ) {
    return this.spaceService.create(user, createSpaceDto, logoImg);
  }

  @Auth()
  @Post(':code')
  join(
    @User() user,
    @Param('code') code: string,
    @Body() body: Partial<CreateSpaceRoleDto>,
  ) {
    return this.spaceService.join(user, code, body);
  }

  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.spaceService.findOne(code);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSpaceDto: UpdateSpaceDto) {
    return this.spaceService.update(+id, updateSpaceDto);
  }

  @Role(Space, SpaceRoleSet.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.spaceService.remove(+id);
  }
}
