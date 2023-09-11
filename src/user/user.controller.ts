import { Controller, Post, Body, HttpStatus, Res, Inject, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { Response, Request } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Controller('users')
export class UserController {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger, private userService: UserService) {}

  private isEmailValid(email: string): boolean {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  @Post("register")
  async register(
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('email') email: string,
    @Res() res: Response,
    @Req() req: Request
  ) {
    this.logger.info(`Register attempt for user: ${username}`, { ipv4: req.ip });

    if (!username || !password || !email) {
      this.logger.warn(`Missing required credentials for user: ${username}`, { ipv4: req.ip });
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Username, password, and email are required.' });
    }

    if (!this.isEmailValid(email)) {
      this.logger.warn(`Invalid email format for user: ${username}`, { ipv4: req.ip });
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid email format.' });
    }

    const result = await this.userService.create(username, password, email);
    this.logger.info(`User creation status for user: ${username}`, { status: result.status, ipv4: req.ip });

    if (result.status !== HttpStatus.CREATED) {
      return res.status(result.status).json({ message: result.message });
    }

    const { user, ...response } = result;

    return res.status(response.status).json({ ...response, user: { usernmae: user.username, email: user.email } });
  }

  @Post("register/signup")
  async signup(
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('email') email: string,
    @Res() res: Response,
    @Req() req: Request
  ) {
    this.logger.info(`Signup attempt for user: ${username}`, { ipv4: req.ip });

    if (!username || !password || !email) {
      this.logger.warn(`Missing required credentials for user: ${username}`, { ipv4: req.ip });
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Username, password, and email are required.' });
    }

    if (!this.isEmailValid(email)) {
      this.logger.warn(`Invalid email format for user: ${username}`, { ipv4: req.ip });
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid email format.' });
    }

    const result = await this.userService.signup_create(username, password, email);
    this.logger.info(`User signup status for user: ${username}`, { status: result.status, ipv4: req.ip });

    if (result.status !== HttpStatus.CREATED) {
      return res.status(result.status).json({ message: result.message });
    }

    const { user, ...response } = result;

    return res.status(response.status).json({ ...response, user: { usernmae: user.username, email: user.email } });
  }
}