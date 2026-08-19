import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiSuccessResponse, apiResponse } from '../common/http/api-response';
import {
  ScoreDistributionDataDto,
  ScoreDistributionResponseDto,
} from './dto/score-distribution-response.dto';
import {
  TopGroupADataDto,
  TopGroupAResponseDto,
} from './dto/top-group-a-response.dto';
import { ReportsService } from './reports.service';

@ApiTags('Reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('score-distribution')
  @ApiOperation({ summary: 'Get score-band distribution for all subjects' })
  @ApiOkResponse({ type: ScoreDistributionResponseDto })
  async getScoreDistribution(): Promise<
    ApiSuccessResponse<ScoreDistributionDataDto>
  > {
    return apiResponse(await this.reportsService.getScoreDistribution());
  }

  @Get('top-group-a')
  @ApiOperation({ summary: 'Get the top 10 Group A candidates' })
  @ApiOkResponse({ type: TopGroupAResponseDto })
  async getTopGroupA(): Promise<ApiSuccessResponse<TopGroupADataDto>> {
    return apiResponse(await this.reportsService.getTopGroupA());
  }
}
