import { CreateSpaceRoleDto } from './create-space-role.dto';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateSpaceRoleDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSpaceRoleDto)
  SpaceRoles: CreateSpaceRoleDto[];
}
