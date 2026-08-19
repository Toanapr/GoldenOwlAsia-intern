import { isValidCorsAllowlist, parseCorsOrigins } from './configure-app';

describe('parseCorsOrigins', () => {
  it('parses and trims a comma-separated allowlist', () => {
    expect(
      parseCorsOrigins('https://g-scores.example, http://localhost:5173 '),
    ).toEqual(['https://g-scores.example', 'http://localhost:5173']);
  });

  it('ignores empty entries', () => {
    expect(parseCorsOrigins('http://localhost:5173, ,')).toEqual([
      'http://localhost:5173',
    ]);
  });

  it.each(['*', 'not-a-url', 'ftp://files.example.com', ', ,'])(
    'rejects unsafe allowlist value %s',
    (value) => expect(isValidCorsAllowlist(value)).toBe(false),
  );

  it('accepts HTTP and HTTPS origins', () => {
    expect(
      isValidCorsAllowlist('https://g-scores.example,http://localhost:5173'),
    ).toBe(true);
  });
});
