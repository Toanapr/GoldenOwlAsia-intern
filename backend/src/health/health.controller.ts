import { Controller, Get, HttpStatus } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { ApiErrorResponseDto } from '../common/http/api-error-response.dto';
import { ApiException } from '../common/http/api.exception';
import { HealthResponseDto } from './dto/health-response.dto';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly dataSource: DataSource) {}

  @Get()
  @ApiOperation({ summary: 'Check API and database health' })
  @ApiOkResponse({ type: HealthResponseDto })
  @ApiServiceUnavailableResponse({ type: ApiErrorResponseDto })
  async check(): Promise<HealthResponseDto> {
    try {
      await this.dataSource.query('SELECT 1');
      return {
        status: 'ok',
        service: 'g-scores-backend',
        database: 'up',
      };
    } catch {
      throw new ApiException(
        HttpStatus.SERVICE_UNAVAILABLE,
        'DATABASE_UNAVAILABLE',
        'Database is temporarily unavailable',
      );
    }
  }
}
