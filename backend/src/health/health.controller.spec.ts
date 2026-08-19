import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;
  const dataSource = { query: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [{ provide: DataSource, useValue: dataSource }],
    }).compile();

    controller = module.get(HealthController);
  });

  it('reports that the API and database are healthy', async () => {
    dataSource.query.mockResolvedValueOnce([{ '?column?': 1 }]);
    await expect(controller.check()).resolves.toEqual({
      status: 'ok',
      service: 'g-scores-backend',
      database: 'up',
    });
  });

  it('reports database failures as a service unavailable error', async () => {
    dataSource.query.mockRejectedValueOnce(new Error('connection failed'));
    await expect(controller.check()).rejects.toMatchObject({ status: 503 });
  });
});
