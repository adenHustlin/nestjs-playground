import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateChatDto {
  id?: number;
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsBoolean()
  anonymous: boolean;

  @IsNotEmpty()
  @IsNumber()
  postId: number;

  @IsOptional()
  @IsNumber()
  parentChatId?: number;
}
