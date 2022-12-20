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
import { LoginDto } from './dto/login.dto';
import { User } from '../../common/decorator/user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async save(@Body() createUserDto: CreateUserDto) {
    return await this.userService.save(createUserDto);
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    return await this.userService.login(body);
  }

  @Auth()
  @Get(':id')
  async findOne(@User() user, @Param('id') id: number) {
    return await this.userService.findOne(user, +id);
  }

  @Auth()
  @Patch(':id')
  @UseInterceptors(FileInterceptor('profileImg', MulterConfig('profileImg')))
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.userService.update(id, file, updateUserDto);
  }

  @Auth()
  @Delete(':id')
  async softDelete(@Param('id') token: number) {
    return await this.userService.softDelete(token);
  }
}
