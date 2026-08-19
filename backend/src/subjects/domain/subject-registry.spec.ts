import { SubjectCode } from './subject-code.enum';
import { SubjectRegistry } from './subject-registry';

describe('SubjectRegistry', () => {
  const registry = new SubjectRegistry();

  it('contains exactly nine subjects in display order', () => {
    expect(registry.getAll()).toHaveLength(9);
    expect(registry.getAll().map(({ order }) => order)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9,
    ]);
  });

  it('looks up a known subject', () => {
    expect(registry.get(SubjectCode.Math)?.csvColumn).toBe('toan');
    expect(registry.get(SubjectCode.ForeignLanguage)?.databaseColumn).toBe(
      'foreign_language',
    );
  });

  it('rejects an unknown subject', () => {
    expect(() => registry.require('unknown')).toThrow(
      'Unknown subject code: unknown',
    );
  });
});
