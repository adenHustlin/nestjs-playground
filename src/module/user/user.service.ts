import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../persistence/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  async save(createUserDto: CreateUserDto): Promise<User> {
    const { email, pw } = createUserDto;
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) throw new BadRequestException('email exists');
    const hash = await bcrypt.hash(pw, 2);
    return await this.userRepository.save({ email, pw: hash });
  }

  async findOne(id: number) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    file: Express.Multer.File,
    updateUserDto: UpdateUserDto,
  ) {
    const { path: profileImg } = file;
    return await this.userRepository.update(
      { id },
      { ...updateUserDto, profileImg },
    );
  }

  async softDelete(id: number) {
    return await this.userRepository.softDelete({ id });
  }

  async login(email, pw) {
    const user = await this.userRepository.findOne({ email });
    if (!user) throw new BadRequestException('invalid email');
    if (!(await bcrypt.compare(pw, user.pw))) throw new BadRequestException();

    return { accessToken: this.authService.generateLoginToken(email, user.id) };
  }
}
