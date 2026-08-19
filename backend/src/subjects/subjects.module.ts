import { Module } from '@nestjs/common';
import { SubjectRegistry } from './domain/subject-registry';

@Module({
  providers: [SubjectRegistry],
  exports: [SubjectRegistry],
})
export class SubjectsModule {}
