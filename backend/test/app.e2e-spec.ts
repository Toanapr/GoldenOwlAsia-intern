import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';
import { App } from 'supertest/types';
import { Repository } from 'typeorm';
import { ApiErrorResponseDto } from '../src/common/http/api-error-response.dto';
import { configureApp } from '../src/common/http/configure-app';
import { setupSwagger } from '../src/common/swagger/setup-swagger';
import { ExamResult } from '../src/exam-results/entities/exam-result.entity';
import { ScoreLookupResponseDto } from '../src/exam-results/dto/score-lookup-response.dto';
import { ExamResultsModule } from '../src/exam-results/exam-results.module';
import { CreateExamResults2026081900000 } from '../src/exam-results/migrations/2026081900000-create-exam-results';
import { HealthModule } from '../src/health/health.module';
import { ReportsModule } from '../src/reports/reports.module';
import { ScoreDistributionResponseDto } from '../src/reports/dto/score-distribution-response.dto';
import { TopGroupAResponseDto } from '../src/reports/dto/top-group-a-response.dto';
import { SubjectsModule } from '../src/subjects/subjects.module';

describe('core API contracts (e2e)', () => {
  let app: INestApplication<App>;
  let repository: Repository<ExamResult>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          url:
            process.env.TEST_DATABASE_URL ??
            'postgresql://postgres:postgres@localhost:5432/g_scores_test',
          entities: [ExamResult],
          migrations: [CreateExamResults2026081900000],
          migrationsRun: true,
          dropSchema: true,
        }),
        SubjectsModule,
        ExamResultsModule,
        ReportsModule,
        HealthModule,
      ],
      providers: [
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: () => 'http://localhost:5173',
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    setupSwagger(app);
    await app.init();
    repository = moduleFixture.get<Repository<ExamResult>>(
      getRepositoryToken(ExamResult),
    );
    await repository.insert(
      Array.from({ length: 12 }, (_, index) => ({
        registrationNumber: `010000${String(index + 1).padStart(2, '0')}`,
        math: String(10 - index * 0.1),
        literature: index === 0 ? null : '6.75',
        foreignLanguage: '8.00',
        physics: String(10 - index * 0.1),
        chemistry: String(10 - index * 0.1),
        foreignLanguageCode: 'N1',
      })),
    );
  });

  afterAll(async () => {
    await app.close();
  });

  it('checks API and database health', () =>
    request(app.getHttpServer()).get('/health').expect(200).expect({
      status: 'ok',
      service: 'g-scores-backend',
      database: 'up',
    }));

  it('returns the lookup envelope with nine subjects', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/scores/01000001')
      .expect(200);
    const body = response.body as unknown as ScoreLookupResponseDto;
    expect(body.meta).toEqual({});
    expect(body.data.scores).toHaveLength(9);
  });

  it('distinguishes invalid registration numbers from missing scores', async () => {
    const invalid = await request(app.getHttpServer())
      .get('/api/v1/scores/abc')
      .expect(400);
    const invalidBody = invalid.body as unknown as ApiErrorResponseDto;
    expect(invalidBody).toMatchObject({
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      path: '/api/v1/scores/abc',
    });
    expect(invalidBody.timestamp).toEqual(expect.any(String));

    const missing = await request(app.getHttpServer())
      .get('/api/v1/scores/99999999')
      .expect(404);
    const missingBody = missing.body as unknown as ApiErrorResponseDto;
    expect(missingBody.code).toBe('SCORE_NOT_FOUND');
  });

  it('returns all subject distributions in an envelope', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/reports/score-distribution')
      .expect(200);
    const body = response.body as unknown as ScoreDistributionResponseDto;
    expect(body.data.subjects).toHaveLength(9);
    expect(body.data.subjects[0].bands).toHaveLength(4);
  });

  it('returns exactly ten ranked Group A students', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/reports/top-group-a')
      .expect(200);
    const body = response.body as unknown as TopGroupAResponseDto;
    expect(body.data.students).toHaveLength(10);
    expect(body.data.students[0]).toMatchObject({
      position: 1,
      registrationNumber: '01000001',
      total: 30,
    });
  });

  it('serves Swagger UI and its OpenAPI document', async () => {
    await request(app.getHttpServer()).get('/docs/').expect(200);
    const response = await request(app.getHttpServer())
      .get('/docs-json')
      .expect(200);
    const document = response.body as unknown as {
      paths: Record<string, unknown>;
    };
    expect(document.paths).toHaveProperty(
      '/api/v1/scores/{registrationNumber}',
    );
  });
});
