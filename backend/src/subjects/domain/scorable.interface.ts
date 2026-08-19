import { SubjectCode } from './subject-code.enum';

export interface Scorable {
  scoreFor(subjectCode: SubjectCode): string | null;
}
