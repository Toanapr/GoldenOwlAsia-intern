import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { resolve } from 'node:path';
import { AppModule } from '../app.module';
import { ExamResultImporterService } from './exam-result-importer.service';

interface CliOptions {
  file: string;
  batchSize: number;
}

const HELP = `Import national exam results from CSV.

Usage:
  npm run data:import -- --file=<path> [--batch-size=2000]

Options:
  --file          Path to the CSV file (required)
  --batch-size    Rows per database upsert (default: 2000)
  --help, -h      Show this help message`;

function readOption(args: string[], name: string): string | undefined {
  const prefix = `--${name}=`;
  const inline = args.find((argument) => argument.startsWith(prefix));
  if (inline) return inline.slice(prefix.length);
  const index = args.indexOf(`--${name}`);
  return index >= 0 ? args[index + 1] : undefined;
}

export function parseOptions(
  args: string[],
  invocationDirectory = process.env.INIT_CWD ?? process.cwd(),
): CliOptions | null {
  if (args.includes('--help') || args.includes('-h')) return null;
  const file = readOption(args, 'file');
  if (!file) throw new Error('Missing required option --file');
  const batchSizeValue = readOption(args, 'batch-size') ?? '2000';
  const batchSize = Number(batchSizeValue);
  if (!Number.isSafeInteger(batchSize) || batchSize <= 0) {
    throw new Error('--batch-size must be a positive integer');
  }
  return { file: resolve(invocationDirectory, file), batchSize };
}

async function main(): Promise<void> {
  const options = parseOptions(process.argv.slice(2));
  if (!options) {
    process.stdout.write(`${HELP}\n`);
    return;
  }

  const app = await NestFactory.createApplicationContext(AppModule);
  try {
    const importer = app.get(ExamResultImporterService);
    await importer.importFile(options.file, { batchSize: options.batchSize });
  } finally {
    await app.close();
  }
}

if (require.main === module) {
  void main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    Logger.error(message, undefined, 'DataImportCli');
    process.exitCode = 1;
  });
}
