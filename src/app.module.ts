import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AdministrationController } from './administration/administration.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    entities: [__dirname + '/**/*.entity.{js,ts}'],
    synchronize: true,
    dropSchema: true, // This will drop the schema each time the application is started
    logging: true,
  }), AuthModule, UserModule],
  controllers: [AdministrationController],
})
export class AppModule {}
