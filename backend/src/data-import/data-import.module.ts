import { Module } from '@nestjs/common';
import { ExamResultsModule } from '../exam-results/exam-results.module';
import { SubjectsModule } from '../subjects/subjects.module';
import { ExamResultCsvMapper } from './csv/exam-result-csv.mapper';
import { ExamResultImporterService } from './exam-result-importer.service';

@Module({
  imports: [SubjectsModule, ExamResultsModule],
  providers: [ExamResultCsvMapper, ExamResultImporterService],
  exports: [ExamResultCsvMapper, ExamResultImporterService],
})
export class DataImportModule {}
