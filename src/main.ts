import { Logger, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable all CORS origins (at least for now)
  app.enableCors();
  // Specifying versioning (current v1)
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'api/v',
  });
  await app.listen(process.env.APP_PORT || 4000);
  Logger.log(
    `Successfully connected to ${process.env.DATABASE_NAME} database`,
    'Database',
  );
  Logger.log(`App is running on port ${process.env.APP_PORT}`, 'App');
}
bootstrap();
