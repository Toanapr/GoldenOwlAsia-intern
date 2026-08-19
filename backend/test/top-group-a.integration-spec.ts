import { DataSource } from 'typeorm';
import { ExamResult } from '../src/exam-results/entities/exam-result.entity';
import { CreateExamResults2026081900000 } from '../src/exam-results/migrations/2026081900000-create-exam-results';
import { ReportsQueryService } from '../src/reports/reports-query.service';
import { ReportsService } from '../src/reports/reports.service';
import { SubjectRegistry } from '../src/subjects/domain/subject-registry';

describe('Top Group A report', () => {
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

    const candidates = [
      ['01000001', '10', '10', '10'],
      ['01000002', '10', '10', '9'],
      ['01000003', '10', '9.5', '9.5'],
      ['01000004', '9.5', '10', '9.5'],
      ['01000005', '9', '10', '10'],
      ['01000006', '9', '10', '10'],
      ['01000007', '9', '9.5', '9.5'],
      ['01000008', '8.5', '9.5', '9.5'],
      ['01000009', '8', '9.5', '9.5'],
      ['01000010', '8', '9', '9.5'],
      ['01000011', '8', '9', '9'],
      ['01000012', '7.5', '9', '9'],
    ];
    await dataSource.getRepository(ExamResult).insert([
      ...candidates.map(([registrationNumber, math, physics, chemistry]) => ({
        registrationNumber,
        math,
        physics,
        chemistry,
      })),
      {
        registrationNumber: '01000013',
        math: '10',
        physics: '10',
        chemistry: null,
      },
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

  it('returns exactly ten complete candidates with deterministic tie-breaks', async () => {
    const result = await service.getTopGroupA();
    expect(result.group).toEqual({
      code: 'A',
      subjects: ['math', 'physics', 'chemistry'],
    });
    expect(result.students).toHaveLength(10);
    expect(result.students.map(({ position }) => position)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    ]);
    expect(
      result.students
        .slice(0, 6)
        .map(({ registrationNumber }) => registrationNumber),
    ).toEqual([
      '01000001',
      '01000002',
      '01000003',
      '01000004',
      '01000005',
      '01000006',
    ]);
    expect(result.students[0].total).toBe(30);
    expect(
      result.students.some(
        ({ registrationNumber }) => registrationNumber === '01000013',
      ),
    ).toBe(false);
  });
});
