import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiServiceUnavailableResponse,
} from '@nestjs/swagger';
import { ApiErrorResponseDto } from '../common/http/api-error-response.dto';
import { ApiSuccessResponse, apiResponse } from '../common/http/api-response';
import { RegistrationNumberParamsDto } from './dto/registration-number-params.dto';
import {
  ScoreLookupDataDto,
  ScoreLookupResponseDto,
} from './dto/score-lookup-response.dto';
import { ExamResultsService } from './exam-results.service';

@ApiTags('Scores')
@Controller('scores')
export class ExamResultsController {
  constructor(private readonly examResultsService: ExamResultsService) {}

  @Get(':registrationNumber')
  @ApiOperation({ summary: 'Find exam scores by registration number' })
  @ApiOkResponse({ type: ScoreLookupResponseDto })
  @ApiBadRequestResponse({
    type: ApiErrorResponseDto,
    example: {
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      message: 'Registration number must contain exactly 8 digits',
      details: ['Registration number must contain exactly 8 digits'],
      path: '/api/v1/scores/abc',
      timestamp: '2026-08-19T10:00:00.000Z',
    },
  })
  @ApiNotFoundResponse({
    type: ApiErrorResponseDto,
    description: 'SCORE_NOT_FOUND',
  })
  @ApiServiceUnavailableResponse({ type: ApiErrorResponseDto })
  @ApiInternalServerErrorResponse({ type: ApiErrorResponseDto })
  async findOne(
    @Param() params: RegistrationNumberParamsDto,
  ): Promise<ApiSuccessResponse<ScoreLookupDataDto>> {
    return apiResponse(
      await this.examResultsService.findByRegistrationNumber(
        params.registrationNumber,
      ),
    );
  }
}
