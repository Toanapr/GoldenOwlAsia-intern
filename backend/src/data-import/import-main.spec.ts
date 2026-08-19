import { parseOptions } from './import-main';

describe('data import CLI options', () => {
  it('resolves a file from the npm invocation directory', () => {
    expect(
      parseOptions(['--file=dataset/diem_thi_thpt_2024.csv'], '/workspace'),
    ).toEqual({
      file: '/workspace/dataset/diem_thi_thpt_2024.csv',
      batchSize: 2_000,
    });
  });

  it('supports a custom batch size', () => {
    expect(
      parseOptions(['--file', '/scores.csv', '--batch-size', '500'], '/repo'),
    ).toEqual({ file: '/scores.csv', batchSize: 500 });
  });

  it('returns null for help', () => {
    expect(parseOptions(['--help'])).toBeNull();
  });
});
