import { PartialType } from '@nestjs/mapped-types';
import { User } from '../../../persistence/entities/user.entity';

export class UpdateUserDto extends PartialType(User) {}
