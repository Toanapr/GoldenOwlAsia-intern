import {
  INestApplication,
  RequestMethod,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { ApiExceptionFilter } from './api-exception.filter';

export function parseCorsOrigins(value: string): string[] {
  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export function isValidCorsAllowlist(value: string): boolean {
  const origins = parseCorsOrigins(value);
  return (
    origins.length > 0 &&
    !origins.includes('*') &&
    origins.every((origin) => {
      try {
        return ['http:', 'https:'].includes(new URL(origin).protocol);
      } catch {
        return false;
      }
    })
  );
}

export function configureApp(app: INestApplication): void {
  const configService = app.get(ConfigService);
  const corsOrigins = parseCorsOrigins(
    configService.getOrThrow<string>('CORS_ORIGIN'),
  );

  app.use(
    helmet({
      // Swagger UI uses inline styles and scripts. The API still receives all
      // other Helmet headers while deployment frontends define their own CSP.
      contentSecurityPolicy: false,
    }),
  );
  app.setGlobalPrefix('api/v1', {
    exclude: [
      { path: 'health', method: RequestMethod.ALL },
      { path: 'docs', method: RequestMethod.ALL },
    ],
  });
  app.enableCors({
    origin: corsOrigins,
    methods: ['GET'],
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
