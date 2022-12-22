import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Auth } from '../../common/decorator/auth.decorator';
import { User } from '../../common/decorator/user.decorator';
import { fileInterceptor } from '../../common/decorator/file.decorator';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Auth()
  @fileInterceptor('postFiles', 'postFiles', true)
  @Post()
  create(
    @User() user,
    @Body() createPostDto: CreatePostDto,
    @UploadedFiles() file: Array<Express.Multer.File>,
  ) {
    return this.postService.create(user, createPostDto, file);
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
