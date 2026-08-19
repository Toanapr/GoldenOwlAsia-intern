import { registerAs } from '@nestjs/config';

export const databaseConfig = registerAs('database', () => ({
  type: 'postgres' as const,
  url: process.env.DATABASE_URL,
  autoLoadEntities: true,
  synchronize: false,
  migrationsRun: false,
}));
