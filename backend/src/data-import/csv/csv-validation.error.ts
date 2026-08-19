export class CsvValidationError extends Error {
  constructor(
    readonly lineNumber: number,
    readonly field: string,
    readonly reason: string,
  ) {
    super(
      `CSV validation failed at line ${lineNumber}, field "${field}": ${reason}`,
    );
    this.name = 'CsvValidationError';
  }
}
