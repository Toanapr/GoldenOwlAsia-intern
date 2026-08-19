import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('G-Scores API')
    .setDescription(
      'Search and report Vietnam 2024 national high school exam scores.',
    )
    .setVersion('1.0')
    .addTag('Scores')
    .addTag('Reports')
    .addTag('Health')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    jsonDocumentUrl: 'docs-json',
  });
}
