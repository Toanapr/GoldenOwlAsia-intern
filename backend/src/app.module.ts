import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { CommonModule } from './common/common.module';
import { DataImportModule } from './data-import/data-import.module';
import { DatabaseModule } from './database/database.module';
import { databaseConfig } from './database/database.config';
import { ExamResultsModule } from './exam-results/exam-results.module';
import { HealthModule } from './health/health.module';
import { ReportsModule } from './reports/reports.module';
import { SubjectsModule } from './subjects/subjects.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: ['.env', '../.env'],
      load: [databaseConfig],
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string()
          .uri({ scheme: ['postgres', 'postgresql'] })
          .required(),
        PORT: Joi.number().port().default(3000),
        CORS_ORIGIN: Joi.string().uri().required(),
      }),
      validationOptions: {
        abortEarly: false,
      },
    }),
    CommonModule,
    DatabaseModule,
    SubjectsModule,
    ExamResultsModule,
    ReportsModule,
    DataImportModule,
    HealthModule,
  ],
})
export class AppModule {}
