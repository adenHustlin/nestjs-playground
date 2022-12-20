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
    return this.spaceService.create(user, {
      ...createSpaceDto,
      logoImg: logoImg.path,
    });
  }

  @Post()
  join(@User() user) {
    return this.spaceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.spaceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSpaceDto: UpdateSpaceDto) {
    return this.spaceService.update(+id, updateSpaceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.spaceService.remove(+id);
  }
}
