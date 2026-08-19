import { Injectable } from '@nestjs/common';
import { SubjectRegistry } from '../subjects/domain/subject-registry';
import {
  DistributionBandDto,
  DistributionBandKey,
  ScoreDistributionDataDto,
} from './dto/score-distribution-response.dto';
import { ReportsQueryService } from './reports-query.service';

const BANDS: readonly Omit<DistributionBandDto, 'count'>[] = [
  {
    key: DistributionBandKey.GreaterThanOrEqualEight,
    label: '>= 8',
  },
  {
    key: DistributionBandKey.GreaterThanOrEqualSixLessThanEight,
    label: '>= 6 và < 8',
  },
  {
    key: DistributionBandKey.GreaterThanOrEqualFourLessThanSix,
    label: '>= 4 và < 6',
  },
  { key: DistributionBandKey.LessThanFour, label: '< 4' },
];

@Injectable()
export class ReportsService {
  constructor(
    private readonly queryService: ReportsQueryService,
    private readonly subjectRegistry: SubjectRegistry,
  ) {}

  async getScoreDistribution(): Promise<ScoreDistributionDataDto> {
    const aggregate = await this.queryService.getScoreDistribution();
    return {
      subjects: this.subjectRegistry.getAll().map((subject) => ({
        subjectCode: subject.code,
        subjectName: subject.displayName,
        totalWithScore: Number(aggregate[`${subject.code}_total`]),
        bands: BANDS.map((band) => ({
          ...band,
          count: Number(aggregate[`${subject.code}_${band.key}`]),
        })),
      })),
    };
  }
}
