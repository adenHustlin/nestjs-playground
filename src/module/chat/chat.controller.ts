import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { User } from '../../common/decorator/user.decorator';
import { Auth } from '../../common/decorator/auth.decorator';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Auth()
  @Post()
  create(@User() user, @Body() createChatDto: CreateChatDto) {
    return this.chatService.create(user, createChatDto);
  }

  @Auth()
  @Delete(':id')
  remove(@User() user, @Param('id') id: string) {
    return this.chatService.remove(user, +id);
  }
}
