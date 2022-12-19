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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterConfig } from '../../config/multer.config';
import { Auth } from '../../common/decorator/auth.decorator';
import { User } from '../../common/decorator/user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async save(@Body() createUserDto: CreateUserDto) {
    return await this.userService.save(createUserDto);
  }

  @Post('login')
  async login(@Body() { email, pw }) {
    return await this.userService.login(email, pw);
  }

  @Get(':id')
  @Auth()
  async findOne(@User() user, @Param('id') id: number) {
    return await this.userService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('profileImg', MulterConfig('profileImg')))
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.userService.update(+id, file, updateUserDto);
  }

  @Delete(':id')
  async softDelete(@Param('id') id: string) {
    return await this.userService.softDelete(+id);
  }
}
