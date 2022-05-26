import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.APP_PORT || 4000);
  Logger.log(
    `App is running on port ${process.env.APP_PORT}`,
    'NestApplication',
  );
}
bootstrap();
