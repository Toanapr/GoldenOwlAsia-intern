import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamResult } from './entities/exam-result.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExamResult])],
  exports: [TypeOrmModule],
})
export class ExamResultsModule {}
