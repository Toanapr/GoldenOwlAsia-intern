import { SubjectRegistry } from '../../subjects/domain/subject-registry';
import { CsvValidationError } from './csv-validation.error';
import { ExamResultCsvMapper } from './exam-result-csv.mapper';

describe('ExamResultCsvMapper', () => {
  const mapper = new ExamResultCsvMapper(new SubjectRegistry());
  const validRow = [
    '01000001',
    '8.4',
    '6.75',
    '8.0',
    '6.0',
    '5.25',
    '5.0',
    '',
    '',
    '',
    'N1',
  ];

  it('accepts the exact dataset header', () => {
    expect(() => mapper.validateHeader(mapper.expectedHeaders)).not.toThrow();
  });

  it('rejects a reordered header', () => {
    const headers = [...mapper.expectedHeaders];
    [headers[1], headers[2]] = [headers[2], headers[1]];
    expect(() => mapper.validateHeader(headers)).toThrow(CsvValidationError);
  });

  it('preserves a leading zero and converts blank scores to null', () => {
    const result = mapper.map(validRow, 2);
    expect(result).toMatchObject({
      registrationNumber: '01000001',
      math: '8.4',
      history: null,
      geography: null,
      civicEducation: null,
      foreignLanguageCode: 'N1',
    });
  });

  it.each([
    ['invalid SBD', 0, '123', 'sbd'],
    ['malformed number', 1, 'abc', 'toan'],
    ['score below range', 1, '-0.1', 'toan'],
    ['score above range', 1, '10.01', 'toan'],
    ['too many decimals', 1, '8.123', 'toan'],
    ['invalid language code', 10, 'N8', 'ma_ngoai_ngu'],
  ])(
    'rejects %s with line and field context',
    (_label, index, value, field) => {
      const row = [...validRow];
      row[index] = value;
      expect(() => mapper.map(row, 42)).toThrow(
        `CSV validation failed at line 42, field "${field}"`,
      );
    },
  );

  it('rejects rows with the wrong column count', () => {
    expect(() => mapper.map(validRow.slice(0, -1), 8)).toThrow(
      'expected 11 columns but received 10',
    );
  });

  it.each([
    ['score without code', '', '8.0'],
    ['code without score', 'N1', ''],
  ])('rejects %s', (_label, code, score) => {
    const row = [...validRow];
    row[3] = score;
    row[10] = code;
    expect(() => mapper.map(row, 12)).toThrow(
      'foreign-language score and code must both be present or both be blank',
    );
  });
});
