import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  public generateLoginToken(email: string, userId: number) {
    const payload = {
      email,
      userId,
    };
    return this.jwtService.sign(payload);
  }
}
