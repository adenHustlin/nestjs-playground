import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  public generateLoginToken(token: string, email: string) {
    const payload = {
      sub: token,
      email,
    };
    return this.jwtService.sign(payload);
  }
}
