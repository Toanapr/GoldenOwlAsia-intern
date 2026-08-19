import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { SubjectRegistry } from '../subjects/domain/subject-registry';

export type DistributionAggregate = Record<string, number>;

@Injectable()
export class ReportsQueryService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly subjectRegistry: SubjectRegistry,
  ) {}

  async getScoreDistribution(): Promise<DistributionAggregate> {
    const selections = this.subjectRegistry.getAll().flatMap((subject) => {
      const column = this.quoteIdentifier(subject.databaseColumn);
      const prefix = subject.code;
      return [
        `COUNT(${column})::int AS "${prefix}_total"`,
        `COUNT(*) FILTER (WHERE ${column} >= 8)::int AS "${prefix}_gte_8"`,
        `COUNT(*) FILTER (WHERE ${column} >= 6 AND ${column} < 8)::int AS "${prefix}_gte_6_lt_8"`,
        `COUNT(*) FILTER (WHERE ${column} >= 4 AND ${column} < 6)::int AS "${prefix}_gte_4_lt_6"`,
        `COUNT(*) FILTER (WHERE ${column} < 4)::int AS "${prefix}_lt_4"`,
      ];
    });
    const rows = (await this.dataSource.query(
      `SELECT ${selections.join(', ')} FROM "exam_results"`,
    )) as unknown;
    if (!Array.isArray(rows) || rows.length !== 1) {
      throw new Error('Score distribution query returned an unexpected result');
    }
    return rows[0] as DistributionAggregate;
  }

  private quoteIdentifier(identifier: string): string {
    if (!/^[a-z_]+$/.test(identifier)) {
      throw new Error(`Unsafe database identifier: ${identifier}`);
    }
    return `"${identifier}"`;
  }
}
