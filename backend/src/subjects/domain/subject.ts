import { ScoreBand } from './score-band.enum';
import { SubjectCode } from './subject-code.enum';

const SCORE_PATTERN = /^(?:10(?:\.0{1,2})?|\d(?:\.\d{1,2})?)$/;

export interface SubjectMetadata {
  code: SubjectCode;
  displayName: string;
  csvColumn: string;
  entityField: string;
  databaseColumn: string;
  order: number;
}

export class Subject {
  readonly code: SubjectCode;
  readonly displayName: string;
  readonly csvColumn: string;
  readonly entityField: string;
  readonly databaseColumn: string;
  readonly order: number;

  constructor(metadata: SubjectMetadata) {
    this.code = metadata.code;
    this.displayName = metadata.displayName;
    this.csvColumn = metadata.csvColumn;
    this.entityField = metadata.entityField;
    this.databaseColumn = metadata.databaseColumn;
    this.order = metadata.order;
    Object.freeze(this);
  }

  isValidScore(value: string): boolean {
    return SCORE_PATTERN.test(value);
  }

  scoreFrom(source: object): string | null {
    const value = (source as Record<string, unknown>)[this.entityField];
    if (value === null || value === undefined) return null;
    if (typeof value === 'string' || typeof value === 'number') {
      return String(value);
    }
    throw new TypeError(`Invalid score value for ${this.code}`);
  }

  classify(value: string | number): ScoreBand {
    const score = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(score) || score < 0 || score > 10) {
      throw new RangeError(`Invalid score for ${this.code}: ${String(value)}`);
    }
    if (score < 4) return ScoreBand.BelowAverage;
    if (score < 6) return ScoreBand.Average;
    if (score < 8) return ScoreBand.Good;
    return ScoreBand.Excellent;
  }
}
