import { CreateUserDto } from './create-user.dto';
import { PickType } from '@nestjs/mapped-types';

export class LoginDto extends PickType(CreateUserDto, ['email', 'pw']) {}
