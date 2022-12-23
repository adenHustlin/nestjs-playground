import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Auth } from '../../common/decorator/auth.decorator';
import { User } from '../../common/decorator/user.decorator';
import { fileInterceptor } from '../../common/decorator/file.decorator';
import { UpdatePostDto } from './dto/update-post.dto';

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

  @Auth()
  @fileInterceptor('postFiles', 'postFiles', true)
  @Put(':id')
  update(
    @User() user,
    @Param('id') id: number,
    @Body() body: UpdatePostDto,
    @UploadedFiles() file: Array<Express.Multer.File>,
  ) {
    return this.postService.update(user, file, +id, body);
  }

  @Auth()
  @Get()
  findAll(@User() user, @Query() query) {
    return this.postService.findAll(user, query);
  }

  @Auth()
  @Get(':id')
  findOne(@User() user, @Param('id') id: number) {
    return this.postService.findOne(user, id);
  }

  @Auth()
  @Delete(':id')
  remove(@User() user, @Param('id') id: string) {
    return this.postService.remove(user, +id);
  }
}
