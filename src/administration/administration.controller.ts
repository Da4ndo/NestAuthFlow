import { Controller, Get, UseGuards, HttpStatus, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Controller('administration')
export class AdministrationController {
  @UseGuards(AuthGuard('jwt'))
  @Get()
  getAdminPanel(@Res() res: Response) {
    return res.status(HttpStatus.OK).json({ message: 'Welcome to the administration panel' });
  }
}
