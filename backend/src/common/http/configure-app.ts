import {
  INestApplication,
  RequestMethod,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiExceptionFilter } from './api-exception.filter';

export function configureApp(app: INestApplication): void {
  const configService = app.get(ConfigService);
  app.setGlobalPrefix('api/v1', {
    exclude: [
      { path: 'health', method: RequestMethod.ALL },
      { path: 'docs', method: RequestMethod.ALL },
    ],
  });
  app.enableCors({
    origin: configService.getOrThrow<string>('CORS_ORIGIN'),
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new ApiExceptionFilter());
}
