import { Controller, Post, Body, Res, Req, HttpStatus, Inject } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';


@Controller('auth')
export class AuthController {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger, private authService: AuthService) {}

  @Post('login')
  async login(
    @Body('usernameOrEmail') usernameOrEmail: string,
    @Body('password') password: string,
    @Res() res: Response,
    @Req() req: Request
  ) {
    this.logger.info(`Login attempt for user: ${usernameOrEmail}`, { ipv4: req.ip });

    if (!usernameOrEmail || !password) {
      this.logger.warn('Missing required credentials.', { ipv4: req.ip });
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Missing required credentials.' });
    }

    const result = await this.authService.login(usernameOrEmail, password);

    if (result.status !== HttpStatus.OK) {
      this.logger.error(`Login failed for user: ${usernameOrEmail} with status: ${result.status}`, { ipv4: req.ip });
      return res.status(result.status).json({ message: result.message });
    }

    this.logger.info(`Login successful for user: ${usernameOrEmail}`, {status: result.status, ipv4: req.ip });
    return res.status(result.status).json(result);
  }
}
