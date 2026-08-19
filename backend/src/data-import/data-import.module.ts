import { Module } from '@nestjs/common';
import { SubjectsModule } from '../subjects/subjects.module';
import { ExamResultCsvMapper } from './csv/exam-result-csv.mapper';

@Module({
  imports: [SubjectsModule],
  providers: [ExamResultCsvMapper],
  exports: [ExamResultCsvMapper],
})
export class DataImportModule {}
