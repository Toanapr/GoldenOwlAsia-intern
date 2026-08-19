import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiServiceUnavailableResponse,
} from '@nestjs/swagger';
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
  @ApiBadRequestResponse({ description: 'Invalid registration number format' })
  @ApiNotFoundResponse({ description: 'Exam result not found' })
  @ApiServiceUnavailableResponse({ description: 'Database unavailable' })
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
