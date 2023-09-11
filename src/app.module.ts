// DEFAULT IMPORT
import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

// [MODULES]
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AdministrationController } from './administration/administration.controller';

const MODULE_IMPORTS = [AuthModule, UserModule];

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    TypeOrmModule.forRoot(
      process.env.NODE_ENV === 'prod'
        ? {
            type: 'mysql',
            host: process.env.DATABASE_HOST,
            port: 3306,
            username: 'mailuser',
            password: process.env.DATABASE_USER_PASSWORD,
            database: 'mailserver',
            entities: [__dirname + '/**/*.entity.{js,ts}'],
            synchronize: true,
            dropSchema: false,
            logging: true,
          }
        : {
            type: 'sqlite',
            database: ':memory:',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
            logging: true,
            dropSchema: true, // This will clear the in-memory database every time the application restarts
          },
    ),
    WinstonModule.forRoot({
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.metadata({
          fillExcept: ['level', 'message', 'timestamp'],
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json(),
        winston.format.printf(({ level, message, timestamp, ipv4, status }) => { 
          return `${timestamp} IP: ${ipv4} ${level}: ${status ?? ''} ${message}`;
        }),
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          filename: `../logs/${new Date().getFullYear()}${
            new Date().getMonth() + 1
          }${new Date().getDate()}.log`,
        }),
      ],
    }),
    ...MODULE_IMPORTS,
  ],
  controllers: [AdministrationController],
})
export class AppModule {}
