import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createReadStream } from 'node:fs';
import { access, constants, stat } from 'node:fs/promises';
import { parse } from 'csv-parse';
import { Repository } from 'typeorm';
import { ExamResult } from '../exam-results/entities/exam-result.entity';
import { ExamResultCsvMapper } from './csv/exam-result-csv.mapper';
import { ExamResultImportRecord } from './csv/exam-result-import-record';

export interface ImportOptions {
  batchSize?: number;
  progressInterval?: number;
}

export interface ImportSummary {
  processed: number;
  upserted: number;
  databaseRows: number;
  elapsedMs: number;
  peakHeapBytes: number;
}

@Injectable()
export class ExamResultImporterService {
  private readonly logger = new Logger(ExamResultImporterService.name);

  constructor(
    @InjectRepository(ExamResult)
    private readonly repository: Repository<ExamResult>,
    private readonly mapper: ExamResultCsvMapper,
  ) {}

  async importFile(
    filePath: string,
    options: ImportOptions = {},
  ): Promise<ImportSummary> {
    const batchSize = options.batchSize ?? 2_000;
    const progressInterval = options.progressInterval ?? 10_000;
    this.validatePositiveInteger(batchSize, 'batchSize');
    this.validatePositiveInteger(progressInterval, 'progressInterval');
    await this.validateFile(filePath);

    const startedAt = Date.now();
    let processed = 0;
    let upserted = 0;
    let peakHeapBytes = process.memoryUsage().heapUsed;
    let headerRead = false;
    let batch: ExamResultImportRecord[] = [];

    const parser = createReadStream(filePath).pipe(
      parse({
        bom: true,
        relax_column_count: true,
        skip_empty_lines: true,
      }),
    );

    for await (const value of parser) {
      const row = value as string[];
      if (!headerRead) {
        this.mapper.validateHeader(row);
        headerRead = true;
        continue;
      }

      batch.push(this.mapper.map(row, processed + 2));
      processed += 1;

      if (batch.length >= batchSize) {
        upserted += await this.upsertBatch(batch);
        batch = [];
      }

      if (processed % progressInterval === 0) {
        peakHeapBytes = Math.max(peakHeapBytes, process.memoryUsage().heapUsed);
        this.logProgress(processed, upserted, startedAt);
      }
    }

    if (!headerRead) {
      throw new Error('CSV file is empty and does not contain a header');
    }
    if (batch.length > 0) {
      upserted += await this.upsertBatch(batch);
    }

    peakHeapBytes = Math.max(peakHeapBytes, process.memoryUsage().heapUsed);
    const databaseRows = await this.repository.count();
    const summary = {
      processed,
      upserted,
      databaseRows,
      elapsedMs: Date.now() - startedAt,
      peakHeapBytes,
    };
    this.logger.log(
      `Import complete: processed=${processed}, upserted=${upserted}, databaseRows=${databaseRows}, elapsedMs=${summary.elapsedMs}, peakHeapBytes=${peakHeapBytes}`,
    );
    return summary;
  }

  private async upsertBatch(batch: ExamResultImportRecord[]): Promise<number> {
    const uniqueRecords = [
      ...new Map(
        batch.map((record) => [record.registrationNumber, record]),
      ).values(),
    ];
    await this.repository.upsert(uniqueRecords, {
      conflictPaths: ['registrationNumber'],
    });
    return uniqueRecords.length;
  }

  private async validateFile(filePath: string): Promise<void> {
    await access(filePath, constants.R_OK).catch(() => {
      throw new Error(
        `CSV file does not exist or is not readable: ${filePath}`,
      );
    });
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) {
      throw new Error(`CSV path is not a file: ${filePath}`);
    }
  }

  private validatePositiveInteger(value: number, name: string): void {
    if (!Number.isSafeInteger(value) || value <= 0) {
      throw new Error(`${name} must be a positive integer`);
    }
  }

  private logProgress(
    processed: number,
    upserted: number,
    startedAt: number,
  ): void {
    this.logger.log(
      `Import progress: processed=${processed}, upserted=${upserted}, elapsedMs=${Date.now() - startedAt}`,
    );
  }
}
