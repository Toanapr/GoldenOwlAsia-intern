import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiExceptionBody } from './api.exception';

interface ErrorResponseBody extends ApiExceptionBody {
  statusCode: number;
  path: string;
  timestamp: string;
}

const DATABASE_CONNECTION_CODES = new Set([
  'ECONNREFUSED',
  'ECONNRESET',
  'ETIMEDOUT',
  '57P01',
  '57P02',
  '57P03',
]);

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();
    const normalized = this.normalize(exception);

    response.status(normalized.statusCode).json({
      ...normalized,
      path: request.originalUrl,
      timestamp: new Date().toISOString(),
    } satisfies ErrorResponseBody);
  }

  private normalize(
    exception: unknown,
  ): Omit<ErrorResponseBody, 'path' | 'timestamp'> {
    if (exception instanceof HttpException) {
      return this.normalizeHttpException(exception);
    }
    if (this.isDatabaseConnectionError(exception)) {
      return {
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        code: 'DATABASE_UNAVAILABLE',
        message: 'Database is temporarily unavailable',
        details: [],
      };
    }
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
      details: [],
    };
  }

  private normalizeHttpException(
    exception: HttpException,
  ): Omit<ErrorResponseBody, 'path' | 'timestamp'> {
    const statusCode = exception.getStatus();
    const body = exception.getResponse();
    if (typeof body === 'object' && body !== null && 'code' in body) {
      const apiBody = body as ApiExceptionBody;
      return {
        statusCode,
        code: apiBody.code,
        message: apiBody.message,
        details: apiBody.details ?? [],
      };
    }

    const messages =
      typeof body === 'object' && body !== null && 'message' in body
        ? this.toMessages(body.message)
        : [exception.message];
    return {
      statusCode,
      code:
        exception instanceof BadRequestException
          ? 'VALIDATION_ERROR'
          : `HTTP_${statusCode}`,
      message: messages[0] ?? 'Request failed',
      details: messages,
    };
  }

  private toMessages(value: unknown): string[] {
    if (Array.isArray(value)) return value.map(String);
    return [String(value)];
  }

  private isDatabaseConnectionError(exception: unknown): boolean {
    if (typeof exception !== 'object' || exception === null) return false;
    const code = 'code' in exception ? String(exception.code) : '';
    return DATABASE_CONNECTION_CODES.has(code) || code.startsWith('08');
  }
}
