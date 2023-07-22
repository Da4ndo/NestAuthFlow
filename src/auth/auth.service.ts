import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const user = this.userService.findOne(username);

    if (!user) {
      return { status: HttpStatus.UNAUTHORIZED, message: 'Invalid login credentials' };
    }

    const isValid = await this.userService.validatePassword(username, password);

    if (!isValid) {
      return { status: HttpStatus.UNAUTHORIZED, message: 'Invalid login credentials' };
    }

    const payload = { username };
    return {
      status: HttpStatus.OK,
      message: 'Login successful',
      access_token: this.jwtService.sign(payload),
    };
  }
}
