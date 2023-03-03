import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enabling Global API prefixes to '/api/v1'
  app.setGlobalPrefix('/api/');
  app.enableVersioning({
    defaultVersion: ['1'],
    type: VersioningType.URI,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();
