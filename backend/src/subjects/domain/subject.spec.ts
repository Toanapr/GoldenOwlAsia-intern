import { ScoreBand } from './score-band.enum';
import { SUBJECTS } from './subject.constants';

describe('Subject', () => {
  const subject = SUBJECTS[0];

  it.each([
    ['0', ScoreBand.BelowAverage],
    ['3.99', ScoreBand.BelowAverage],
    ['4', ScoreBand.Average],
    ['5.99', ScoreBand.Average],
    ['6', ScoreBand.Good],
    ['7.99', ScoreBand.Good],
    ['8', ScoreBand.Excellent],
    ['10', ScoreBand.Excellent],
  ])('classifies %s as %s', (score, expected) => {
    expect(subject.classify(score)).toBe(expected);
  });

  it.each(['0', '8.4', '6.75', '10', '10.00'])(
    'accepts valid score %s',
    (score) => expect(subject.isValidScore(score)).toBe(true),
  );

  it.each(['-1', '10.01', '8.123', 'abc', ''])(
    'rejects invalid score %s',
    (score) => expect(subject.isValidScore(score)).toBe(false),
  );

  it('reads its score from the configured entity field', () => {
    expect(subject.scoreFrom({ math: '8.40' })).toBe('8.40');
    expect(subject.scoreFrom({ math: null })).toBeNull();
  });
});
