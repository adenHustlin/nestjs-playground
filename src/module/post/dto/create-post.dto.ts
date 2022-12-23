import { PostType } from '../../../common/constatns';
import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePostDto {
  id?: number;

  @IsEnum(PostType)
  @IsNotEmpty()
  postType: PostType;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  anonymous: boolean;

  @IsNotEmpty()
  spaceId: number;
}
