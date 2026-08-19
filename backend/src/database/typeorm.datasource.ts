import { config } from 'dotenv';
import { resolve } from 'node:path';
import { DataSource } from 'typeorm';
import { ExamResult } from '../exam-results/entities/exam-result.entity';
import { CreateExamResults2026081900000 } from '../exam-results/migrations/2026081900000-create-exam-results';

config({
  path: [resolve(process.cwd(), '.env'), resolve(process.cwd(), '../.env')],
});

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_ADMIN_URL || process.env.DATABASE_URL,
  entities: [ExamResult],
  migrations: [CreateExamResults2026081900000],
  synchronize: false,
});
