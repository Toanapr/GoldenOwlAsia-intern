import { DataSource } from 'typeorm';
import { ExamResult } from '../src/exam-results/entities/exam-result.entity';
import { CreateExamResults2026081900000 } from '../src/exam-results/migrations/2026081900000-create-exam-results';
import { ReportsQueryService } from '../src/reports/reports-query.service';
import { ReportsService } from '../src/reports/reports.service';
import { SubjectRegistry } from '../src/subjects/domain/subject-registry';

describe('score distribution report', () => {
  let dataSource: DataSource;
  let service: ReportsService;

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

    const scores = ['0', '3.99', '4', '5.99', '6', '7.99', '8', '10'];
    await dataSource.getRepository(ExamResult).insert([
      ...scores.map((score, index) => ({
        registrationNumber: `0100000${index + 1}`,
        math: score,
        literature: score,
        foreignLanguage: score,
        physics: score,
        chemistry: score,
        biology: score,
        history: score,
        geography: score,
        civicEducation: score,
        foreignLanguageCode: 'N1',
      })),
      { registrationNumber: '01000009' },
    ]);
    const registry = new SubjectRegistry();
    service = new ReportsService(
      new ReportsQueryService(dataSource, registry),
      registry,
    );
  });

  afterAll(async () => {
    if (dataSource?.isInitialized) {
      await dataSource.dropDatabase();
      await dataSource.destroy();
    }
  });

  it('classifies every boundary and excludes null from totals', async () => {
    const result = await service.getScoreDistribution();
    expect(result.subjects).toHaveLength(9);
    for (const subject of result.subjects) {
      expect(subject.totalWithScore).toBe(8);
      expect(subject.bands.map(({ count }) => count)).toEqual([2, 2, 2, 2]);
    }
  });
});
