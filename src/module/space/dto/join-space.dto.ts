import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { SpaceRoleSet } from '../../../common/constatns';

export class JoinSpaceDto {
  id?: number;

  @IsString()
  @IsNotEmpty()
  roleName: string;

  @IsEnum(SpaceRoleSet)
  @IsNotEmpty()
  roleSet: SpaceRoleSet;
}
