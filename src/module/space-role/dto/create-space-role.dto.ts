import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { SpaceRoleSet } from '../../../common/constatns';

export class CreateSpaceRoleDto {
  id?: number;

  @IsString()
  @IsNotEmpty()
  roleName: string;

  @IsEnum(SpaceRoleSet)
  @IsNotEmpty()
  roleSet: SpaceRoleSet;
}
