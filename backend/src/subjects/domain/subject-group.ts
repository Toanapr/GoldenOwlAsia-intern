import { Scorable } from './scorable.interface';
import { SubjectCode } from './subject-code.enum';
import { Subject } from './subject';

export class SubjectGroup {
  constructor(
    readonly code: string,
    readonly subjects: readonly Subject[],
  ) {
    if (subjects.length === 0) {
      throw new Error('A subject group must contain at least one subject');
    }
    Object.freeze(this.subjects);
    Object.freeze(this);
  }

  totalOf(scorable: Scorable): number | null {
    let total = 0;
    for (const subject of this.subjects) {
      const score = scorable.scoreFor(subject.code);
      if (score === null) return null;
      total += Number(score);
    }
    return total;
  }
}

export function createGroupA(subjects: readonly Subject[]): SubjectGroup {
  const groupACodes = new Set([
    SubjectCode.Math,
    SubjectCode.Physics,
    SubjectCode.Chemistry,
  ]);
  return new SubjectGroup(
    'A',
    subjects.filter((subject) => groupACodes.has(subject.code)),
  );
}
