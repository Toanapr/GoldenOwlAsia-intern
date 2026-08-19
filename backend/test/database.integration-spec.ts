import { DataSource } from 'typeorm';
import { ExamResult } from '../src/exam-results/entities/exam-result.entity';
import { CreateExamResults2026081900000 } from '../src/exam-results/migrations/2026081900000-create-exam-results';

describe('exam_results migration', () => {
  let dataSource: DataSource;

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
  });

  afterAll(async () => {
    if (dataSource?.isInitialized) {
      await dataSource.dropDatabase();
      await dataSource.destroy();
    }
  });

  it('stores a valid result while preserving its leading zero', async () => {
    await dataSource.getRepository(ExamResult).insert({
      registrationNumber: '01000001',
      math: '8.40',
      literature: '6.75',
      foreignLanguage: '8.00',
      foreignLanguageCode: 'N1',
    });

    const result = await dataSource
      .getRepository(ExamResult)
      .findOneByOrFail({ registrationNumber: '01000001' });

    expect(result.registrationNumber).toBe('01000001');
    expect(result.math).toBe('8.40');
  });

  it.each([
    ['registration number', { registrationNumber: '123' }],
    ['score range', { registrationNumber: '01000002', math: '10.01' }],
    [
      'foreign-language code',
      {
        registrationNumber: '01000003',
        foreignLanguage: '7.00',
        foreignLanguageCode: 'X1',
      },
    ],
    [
      'foreign-language pair',
      { registrationNumber: '01000004', foreignLanguage: '7.00' },
    ],
  ])('rejects an invalid %s', async (_label, values) => {
    await expect(
      dataSource.getRepository(ExamResult).insert(values),
    ).rejects.toThrow();
  });
});
