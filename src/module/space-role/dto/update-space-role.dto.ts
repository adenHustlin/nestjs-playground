import { CreateSpaceRoleDto } from './create-space-role.dto';
import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateSpaceRoleDto {
  @IsNumber()
  @IsNotEmpty()
  spaceId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSpaceRoleDto)
  SpaceRoles: CreateSpaceRoleDto[];
}
