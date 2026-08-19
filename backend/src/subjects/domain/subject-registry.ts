import { Injectable } from '@nestjs/common';
import { SUBJECTS } from './subject.constants';
import { SubjectCode } from './subject-code.enum';
import { Subject } from './subject';

@Injectable()
export class SubjectRegistry {
  private readonly byCode = new Map(
    SUBJECTS.map((subject) => [subject.code, subject]),
  );

  get(code: SubjectCode | string): Subject | undefined {
    return this.byCode.get(code as SubjectCode);
  }

  getAll(): readonly Subject[] {
    return SUBJECTS;
  }

  require(code: SubjectCode | string): Subject {
    const subject = this.get(code);
    if (!subject) {
      throw new Error(`Unknown subject code: ${code}`);
    }
    return subject;
  }
}
