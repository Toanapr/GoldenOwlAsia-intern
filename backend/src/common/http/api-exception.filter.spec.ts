import { ArgumentsHost, BadRequestException, HttpStatus } from '@nestjs/common';
import { ApiExceptionFilter } from './api-exception.filter';
import { ApiException } from './api.exception';

describe('ApiExceptionFilter', () => {
  const filter = new ApiExceptionFilter();

  function execute(exception: unknown) {
    const status = jest.fn().mockReturnThis();
    const json = jest.fn<void, [Record<string, unknown>]>();
    const host = {
      switchToHttp: () => ({
        getRequest: () => ({ originalUrl: '/api/v1/test' }),
        getResponse: () => ({ status, json }),
      }),
    } as unknown as ArgumentsHost;

    filter.catch(exception, host);
    const [body] = json.mock.calls[0];
    return { status, body };
  }

  it('normalizes validation errors', () => {
    const result = execute(new BadRequestException(['invalid value']));
    expect(result.status).toHaveBeenCalledWith(400);
    expect(result.body).toMatchObject({
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      message: 'invalid value',
      details: ['invalid value'],
      path: '/api/v1/test',
    });
  });

  it('preserves explicit application error codes', () => {
    const result = execute(
      new ApiException(
        HttpStatus.NOT_FOUND,
        'SCORE_NOT_FOUND',
        'Score not found',
      ),
    );
    expect(result.body).toMatchObject({
      statusCode: 404,
      code: 'SCORE_NOT_FOUND',
    });
  });

  it('maps database connectivity errors to 503 without leaking details', () => {
    const result = execute(
      Object.assign(new Error('postgresql://secret'), { code: 'ECONNREFUSED' }),
    );
    expect(result.body).toMatchObject({
      statusCode: 503,
      code: 'DATABASE_UNAVAILABLE',
      message: 'Database is temporarily unavailable',
      details: [],
    });
    expect(JSON.stringify(result.body)).not.toContain('secret');
  });

  it('hides unexpected exception details', () => {
    const result = execute(new Error('sensitive SQL'));
    expect(result.body).toMatchObject({
      statusCode: 500,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
      details: [],
    });
  });
});
