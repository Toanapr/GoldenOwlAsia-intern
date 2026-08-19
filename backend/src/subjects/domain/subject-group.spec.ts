import { Scorable } from './scorable.interface';
import { SUBJECTS } from './subject.constants';
import { SubjectCode } from './subject-code.enum';
import { createGroupA } from './subject-group';

class ScoreRecord implements Scorable {
  constructor(private readonly scores: Partial<Record<SubjectCode, string>>) {}

  scoreFor(subjectCode: SubjectCode): string | null {
    return this.scores[subjectCode] ?? null;
  }
}

describe('SubjectGroup', () => {
  const groupA = createGroupA(SUBJECTS);

  it('sums math, physics and chemistry', () => {
    const result = new ScoreRecord({
      [SubjectCode.Math]: '8.40',
      [SubjectCode.Physics]: '6.00',
      [SubjectCode.Chemistry]: '5.25',
    });
    expect(groupA.totalOf(result)).toBe(19.65);
  });

  it('returns null when a subject is missing', () => {
    const result = new ScoreRecord({
      [SubjectCode.Math]: '8.40',
      [SubjectCode.Physics]: '6.00',
    });
    expect(groupA.totalOf(result)).toBeNull();
  });
});
