import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { SubjectCode } from '../subjects/domain/subject-code.enum';
import { SubjectGroup } from '../subjects/domain/subject-group';
import { SubjectRegistry } from '../subjects/domain/subject-registry';

export type DistributionAggregate = Record<string, number>;

export interface SubjectGroupRow {
  registrationNumber: string;
  scores: Partial<Record<SubjectCode, string>>;
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

  async getTopSubjectGroup(
    group: SubjectGroup,
    limit = 10,
  ): Promise<SubjectGroupRow[]> {
    const subjectColumns = group.subjects.map((subject) => ({
      subject,
      expression: `results.${this.subjectColumn(subject.code)}`,
    }));
    const total = `(${subjectColumns
      .map(({ expression }) => expression)
      .join(' + ')})`;
    const scoreSelections = subjectColumns
      .map(
        ({ subject, expression }) =>
          `${expression}::text AS ${this.quoteIdentifier(subject.code)}`,
      )
      .join(',\n          ');
    const completeScoreConditions = subjectColumns
      .map(({ expression }) => `${expression} IS NOT NULL`)
      .join('\n          AND ');
    const scoreTieBreakers = subjectColumns
      .map(({ expression }) => `${expression} DESC`)
      .join(',\n          ');
    const rows = (await this.dataSource.query(
      `
        SELECT
          "registration_number" AS "registrationNumber",
          ${scoreSelections},
          ${total}::text AS "total"
        FROM "exam_results" AS results
        WHERE ${completeScoreConditions}
        ORDER BY
          ${total} DESC,
          ${scoreTieBreakers},
          "registration_number" ASC
        LIMIT $1
      `,
      [limit],
    )) as unknown;
    if (!Array.isArray(rows)) {
      throw new Error('Top subject group query returned an unexpected result');
    }
    return rows.map((row: Record<string, string>) => ({
      registrationNumber: row.registrationNumber,
      scores: Object.fromEntries(
        group.subjects.map((subject) => [subject.code, row[subject.code]]),
      ),
      total: row.total,
    }));
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
