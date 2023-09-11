import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { validateDOTENV } from './library/env.validater';
import helmet from 'helmet';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

async function bootstrap() {
  process.env.NODE_ENV = process.env.NODE_ENV === 'production' ? 'prod' : process.env.NODE_ENV ?? 'local';
  const envFilePath = `.env.${process.env.NODE_ENV}`;

  if (fs.existsSync(envFilePath)) {
    dotenv.config({ path: envFilePath });
  }

  validateDOTENV();

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.NODE_ENV === "prod" ? [process.env.DOMAIN_ENABLE_CORPS ?? ''] : [`http://localhost:${process.env.PORT}`]
  });

  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
