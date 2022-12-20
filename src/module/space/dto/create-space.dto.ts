import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSpaceRoleDto } from '../../space-role/dto/create-space-role.dto';

export class CreateSpaceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  logoImg: string;

  @ValidateNested({ each: true })
  @Type(() => CreateSpaceRoleDto)
  SpaceRoles: CreateSpaceRoleDto[];
}
