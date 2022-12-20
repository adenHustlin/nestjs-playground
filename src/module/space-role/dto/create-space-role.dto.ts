import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { RoleSet } from '../../../persistence/entities/space-role.entity';

export class CreateSpaceRoleDto {
  @IsString()
  @IsNotEmpty()
  roleName: string;

  @IsEnum(RoleSet)
  roleSet: RoleSet;
}
