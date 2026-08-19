import { HttpException, HttpStatus } from '@nestjs/common';

export interface ApiExceptionBody {
  code: string;
  message: string;
  details: unknown[];
}

export class ApiException extends HttpException {
  constructor(
    statusCode: HttpStatus,
    code: string,
    message: string,
    details: unknown[] = [],
  ) {
    super({ code, message, details } satisfies ApiExceptionBody, statusCode);
  }
}
