import { Injectable } from '@nestjs/common';
import { SubjectCode } from '../../subjects/domain/subject-code.enum';
import { SubjectRegistry } from '../../subjects/domain/subject-registry';
import { CsvValidationError } from './csv-validation.error';
import { ExamResultImportRecord } from './exam-result-import-record';

const REGISTRATION_NUMBER_PATTERN = /^\d{8}$/;
const FOREIGN_LANGUAGE_CODE_PATTERN = /^N[1-7]$/;

@Injectable()
export class ExamResultCsvMapper {
  private readonly subjects;
  readonly expectedHeaders: readonly string[];

  constructor(subjectRegistry: SubjectRegistry) {
    this.subjects = subjectRegistry.getAll();
    this.expectedHeaders = [
      'sbd',
      ...this.subjects.map((subject) => subject.csvColumn),
      'ma_ngoai_ngu',
    ];
  }

  validateHeader(headers: readonly string[]): void {
    if (
      headers.length !== this.expectedHeaders.length ||
      headers.some((header, index) => header !== this.expectedHeaders[index])
    ) {
      throw new CsvValidationError(
        1,
        'header',
        `expected ${this.expectedHeaders.join(',')} but received ${headers.join(',')}`,
      );
    }
  }

  map(values: readonly string[], lineNumber: number): ExamResultImportRecord {
    if (values.length !== this.expectedHeaders.length) {
      throw new CsvValidationError(
        lineNumber,
        'row',
        `expected ${this.expectedHeaders.length} columns but received ${values.length}`,
      );
    }

    const registrationNumber = values[0].trim();
    if (!REGISTRATION_NUMBER_PATTERN.test(registrationNumber)) {
      throw new CsvValidationError(
        lineNumber,
        'sbd',
        'must contain exactly 8 digits',
      );
    }

    const scores = {} as Record<SubjectCode, string | null>;
    this.subjects.forEach((subject, index) => {
      const value = this.blankToNull(values[index + 1]);
      if (value !== null && !subject.isValidScore(value)) {
        throw new CsvValidationError(
          lineNumber,
          subject.csvColumn,
          'must be a decimal between 0 and 10 with at most 2 decimal places',
        );
      }
      scores[subject.code] = value;
    });

    const foreignLanguageCode = this.blankToNull(values[10]);
    if (
      foreignLanguageCode !== null &&
      !FOREIGN_LANGUAGE_CODE_PATTERN.test(foreignLanguageCode)
    ) {
      throw new CsvValidationError(
        lineNumber,
        'ma_ngoai_ngu',
        'must be one of N1-N7',
      );
    }

    const foreignLanguage = scores[SubjectCode.ForeignLanguage];
    if ((foreignLanguage === null) !== (foreignLanguageCode === null)) {
      throw new CsvValidationError(
        lineNumber,
        'ma_ngoai_ngu',
        'foreign-language score and code must both be present or both be blank',
      );
    }

    return {
      registrationNumber,
      math: scores[SubjectCode.Math],
      literature: scores[SubjectCode.Literature],
      foreignLanguage,
      physics: scores[SubjectCode.Physics],
      chemistry: scores[SubjectCode.Chemistry],
      biology: scores[SubjectCode.Biology],
      history: scores[SubjectCode.History],
      geography: scores[SubjectCode.Geography],
      civicEducation: scores[SubjectCode.CivicEducation],
      foreignLanguageCode,
    };
  }

  private blankToNull(value: string): string | null {
    const normalized = value.trim();
    return normalized === '' ? null : normalized;
  }
}
