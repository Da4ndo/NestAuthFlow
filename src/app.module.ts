import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AdministrationController } from './administration/administration.controller';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [AdministrationController],
})
export class AppModule {}
