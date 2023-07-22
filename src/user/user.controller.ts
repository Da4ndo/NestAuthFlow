import { Controller, Post, Body, HttpStatus, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async create(
    @Body('username') username: string,
    @Body('password') password: string,
    @Res() res: Response,
  ) {
    const result = await this.userService.create(username, password);

    if (result.status !== HttpStatus.CREATED) {
      return res.status(result.status).json({ message: result.message });
    }

    const { user, ...response } = result;
    const { password: _, ...userWithoutPassword } = user;

    return res.status(response.status).json({ ...response, user: userWithoutPassword });
  }
}
