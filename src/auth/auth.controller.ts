import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
    @Res() res: Response,
  ) {
    const result = await this.authService.login(username, password);

    if (result.status !== HttpStatus.OK) {
      return res.status(result.status).json({ message: result.message });
    }

    return res.status(result.status).json(result);
  }
}
