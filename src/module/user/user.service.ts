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

  async save(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    const user = await this.userRepository.findOne({ email });
    if (user) throw new BadRequestException('email exists');
    const userEnt = this.userRepository.create(createUserDto);
    const savedUser = await this.userRepository.save(userEnt);
    return savedUser.token;
  }

  async login(body) {
    const { email, pw } = body;
    const user = await this.userRepository.findOne({ email });
    if (!user) throw new BadRequestException('invalid email');
    if (!(await bcrypt.compare(pw, user.pw))) throw new BadRequestException();

    return {
      accessToken: this.authService.generateLoginToken(user.token, user.email),
    };
  }

  async findOne(reqUser: User, id: number) {
    if (id === Number(reqUser.id)) {
      return {
        id: reqUser.id,
        lasName: reqUser.lastName,
        firstName: reqUser.firstName,
        email: reqUser.email,
        profileImg: reqUser.profileImg,
      };
    }
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) throw new BadRequestException('invalid user id');
    return user;
  }

  async findOneForJwtValidation(token: string, email: string) {
    return await this.userRepository.findOne({ where: { token, email } });
  }

  async update(
    id: number,
    file: Express.Multer.File,
    updateUserDto: UpdateUserDto,
  ) {
    return await this.userRepository.update(
      { id },
      { ...updateUserDto, profileImg: file?.path },
    );
  }

  async softDelete(id: number) {
    return await this.userRepository.softDelete({ id });
  }
}
