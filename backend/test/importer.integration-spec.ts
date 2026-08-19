import { join } from 'node:path';
import { DataSource } from 'typeorm';
import { ExamResultCsvMapper } from '../src/data-import/csv/exam-result-csv.mapper';
import { ExamResultImporterService } from '../src/data-import/exam-result-importer.service';
import { ExamResult } from '../src/exam-results/entities/exam-result.entity';
import { CreateExamResults2026081900000 } from '../src/exam-results/migrations/2026081900000-create-exam-results';
import { SubjectRegistry } from '../src/subjects/domain/subject-registry';

describe('ExamResultImporterService', () => {
  let dataSource: DataSource;
  let importer: ExamResultImporterService;
  const fixture = (name: string) => join(__dirname, 'fixtures', name);

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
    importer = new ExamResultImporterService(
      dataSource.getRepository(ExamResult),
      new ExamResultCsvMapper(new SubjectRegistry()),
    );
  });

  afterAll(async () => {
    if (dataSource?.isInitialized) {
      await dataSource.dropDatabase();
      await dataSource.destroy();
    }
  });

  it('imports in batches and is idempotent', async () => {
    const first = await importer.importFile(fixture('exam-results.csv'), {
      batchSize: 1,
      progressInterval: 1,
    });
    const second = await importer.importFile(fixture('exam-results.csv'), {
      batchSize: 2,
    });

    expect(first.processed).toBe(2);
    expect(first.databaseRows).toBe(2);
    expect(second.databaseRows).toBe(2);
  });

  it('updates an existing registration number on rerun', async () => {
    await importer.importFile(fixture('exam-results-updated.csv'));
    const result = await dataSource
      .getRepository(ExamResult)
      .findOneByOrFail({ registrationNumber: '01000001' });

    expect(result.math).toBe('9.00');
    expect(await dataSource.getRepository(ExamResult).count()).toBe(2);
  });

  it('uses the last occurrence of a duplicate within one batch', async () => {
    const summary = await importer.importFile(
      fixture('exam-results-duplicate.csv'),
    );
    const result = await dataSource
      .getRepository(ExamResult)
      .findOneByOrFail({ registrationNumber: '01000002' });

    expect(summary.processed).toBe(2);
    expect(summary.upserted).toBe(1);
    expect(summary.databaseRows).toBe(2);
    expect(result.math).toBe('9.20');
  });
});
