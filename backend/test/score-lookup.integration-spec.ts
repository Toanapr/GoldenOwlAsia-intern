import { HttpStatus } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ExamResult } from '../src/exam-results/entities/exam-result.entity';
import { ExamResultsService } from '../src/exam-results/exam-results.service';
import { CreateExamResults2026081900000 } from '../src/exam-results/migrations/2026081900000-create-exam-results';
import { SubjectRegistry } from '../src/subjects/domain/subject-registry';

describe('ExamResultsService', () => {
  let dataSource: DataSource;
  let service: ExamResultsService;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: 'postgres',
      url:
        process.env.TEST_DATABASE_URL ??
        'postgresql://postgres:postgres@localhost:5432/g_scores_test',
      entities: [ExamResult],
      migrations: [CreateExamResults2026081900000],
      dropSchema: true,
    });
    await dataSource.initialize();
    await dataSource.runMigrations();
    await dataSource.getRepository(ExamResult).insert({
      registrationNumber: '01000001',
      math: '8.40',
      literature: '6.75',
      foreignLanguage: '8.00',
      physics: '6.00',
      chemistry: '5.25',
      biology: '5.00',
      foreignLanguageCode: 'N1',
    });
    service = new ExamResultsService(
      dataSource.getRepository(ExamResult),
      new SubjectRegistry(),
    );
  });

  afterAll(async () => {
    if (dataSource?.isInitialized) {
      await dataSource.dropDatabase();
      await dataSource.destroy();
    }
  });

  it('returns all nine subjects in registry order and preserves nulls', async () => {
    const result = await service.findByRegistrationNumber('01000001');
    expect(result.registrationNumber).toBe('01000001');
    expect(result.scores).toHaveLength(9);
    expect(result.scores[0]).toMatchObject({
      subjectCode: 'math',
      subjectName: 'Toán',
      score: 8.4,
    });
    expect(result.scores[6].score).toBeNull();
  });

  it('throws SCORE_NOT_FOUND for an unknown valid number', async () => {
    await expect(
      service.findByRegistrationNumber('99999999'),
    ).rejects.toMatchObject({
      status: HttpStatus.NOT_FOUND,
      response: expect.objectContaining({ code: 'SCORE_NOT_FOUND' }) as object,
    });
  });
});
