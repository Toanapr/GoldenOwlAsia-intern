import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { SubjectCode } from '../subjects/domain/subject-code.enum';
import { SubjectRegistry } from '../subjects/domain/subject-registry';

export type DistributionAggregate = Record<string, number>;

export interface GroupARow {
  registrationNumber: string;
  math: string;
  physics: string;
  chemistry: string;
  total: string;
}

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

  async getTopGroupA(limit = 10): Promise<GroupARow[]> {
    const math = `results.${this.subjectColumn(SubjectCode.Math)}`;
    const physics = `results.${this.subjectColumn(SubjectCode.Physics)}`;
    const chemistry = `results.${this.subjectColumn(SubjectCode.Chemistry)}`;
    const total = `(${math} + ${physics} + ${chemistry})`;
    const rows = (await this.dataSource.query(
      `
        SELECT
          "registration_number" AS "registrationNumber",
          ${math}::text AS "math",
          ${physics}::text AS "physics",
          ${chemistry}::text AS "chemistry",
          ${total}::text AS "total"
        FROM "exam_results" AS results
        WHERE ${math} IS NOT NULL
          AND ${physics} IS NOT NULL
          AND ${chemistry} IS NOT NULL
        ORDER BY
          ${total} DESC,
          ${math} DESC,
          ${physics} DESC,
          ${chemistry} DESC,
          "registration_number" ASC
        LIMIT $1
      `,
      [limit],
    )) as unknown;
    if (!Array.isArray(rows)) {
      throw new Error('Top Group A query returned an unexpected result');
    }
    return rows as GroupARow[];
  }

  private subjectColumn(code: SubjectCode): string {
    return this.quoteIdentifier(
      this.subjectRegistry.require(code).databaseColumn,
    );
  }

  private quoteIdentifier(identifier: string): string {
    if (!/^[a-z_]+$/.test(identifier)) {
      throw new Error(`Unsafe database identifier: ${identifier}`);
    }
    return `"${identifier}"`;
  }
}
