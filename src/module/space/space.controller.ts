import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
} from '@nestjs/common';
import { SpaceService } from './space.service';
import { Role } from '../../common/decorator/role.decorator';
import { SpaceRoleSet } from '../../common/constatns';
import { UserToSpace } from '../../persistence/entities/user-to-space.entity';
import { fileInterceptor } from '../../common/decorator/file.decorator';
import { User } from '../../common/decorator/user.decorator';
import { JoinSpaceDto } from './dto/join-space.dto';
import { CreateSpaceDto } from './dto/create-space.dto';
import { Auth } from '../../common/decorator/auth.decorator';

@Controller('space')
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}

  // @Auth()
  @Auth()
  @Post()
  @fileInterceptor('logoImg', 'spaceLogoImg')
  create(
    @User() user,
    @UploadedFile() logoImg: Express.Multer.File,
    @Body() createSpaceDto: CreateSpaceDto,
  ) {
    return this.spaceService.create(user, createSpaceDto, logoImg);
  }

  @Role(UserToSpace, [SpaceRoleSet.CREATOR, SpaceRoleSet.ADMIN])
  @Post(':code')
  join(@User() user, @Param('code') code: string, @Body() body: JoinSpaceDto) {
    return this.spaceService.join(user, code, body);
  }

  @Role(UserToSpace, [
    SpaceRoleSet.CREATOR,
    SpaceRoleSet.ADMIN,
    SpaceRoleSet.PARTICIPANT,
  ])
  @Get(':id')
  findOne(@User() user, @Param('id') id: number) {
    return this.spaceService.findOne(user, +id);
  }

  @Role(UserToSpace, [SpaceRoleSet.CREATOR])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.spaceService.remove(+id);
  }
}
