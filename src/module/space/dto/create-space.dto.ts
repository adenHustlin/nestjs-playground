import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSpaceRoleDto } from '../../space-role/dto/create-space-role.dto';

export class CreateSpaceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  logoImg: string;
  @IsNotEmpty()
  @IsString()
  creatorRoleName: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSpaceRoleDto)
  SpaceRoles: CreateSpaceRoleDto[];
}
