import { PostType } from '../../../common/constatns';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @IsEnum(PostType)
  @IsNotEmpty()
  postType: PostType;

  @IsString()
  @IsNotEmpty()
  content: string;

  anonymous: boolean;

  @IsNotEmpty()
  spaceId: number;
}
