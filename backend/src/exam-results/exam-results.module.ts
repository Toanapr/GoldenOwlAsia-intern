import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubjectsModule } from '../subjects/subjects.module';
import { ExamResult } from './entities/exam-result.entity';
import { ExamResultsController } from './exam-results.controller';
import { ExamResultsService } from './exam-results.service';

@Module({
  imports: [TypeOrmModule.forFeature([ExamResult]), SubjectsModule],
  controllers: [ExamResultsController],
  providers: [ExamResultsService],
  exports: [TypeOrmModule],
})
export class ExamResultsModule {}
