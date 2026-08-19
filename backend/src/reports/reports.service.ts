import { Injectable } from '@nestjs/common';
import { SubjectRegistry } from '../subjects/domain/subject-registry';
import { SubjectCode } from '../subjects/domain/subject-code.enum';
import { createGroupA, SubjectGroup } from '../subjects/domain/subject-group';
import {
  DistributionBandDto,
  DistributionBandKey,
  ScoreDistributionDataDto,
} from './dto/score-distribution-response.dto';
import { TopGroupADataDto } from './dto/top-group-a-response.dto';
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
  private readonly groupA: SubjectGroup;

  constructor(
    private readonly queryService: ReportsQueryService,
    private readonly subjectRegistry: SubjectRegistry,
  ) {
    this.groupA = createGroupA(this.subjectRegistry.getAll());
  }

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

  async getTopGroupA(): Promise<TopGroupADataDto> {
    const rows = await this.queryService.getTopSubjectGroup(this.groupA, 10);
    return {
      group: {
        code: this.groupA.code,
        subjects: this.groupA.subjects.map((subject) => subject.code),
      },
      students: rows.map((row, index) => ({
        position: index + 1,
        registrationNumber: row.registrationNumber,
        math: Number(row.scores[SubjectCode.Math]),
        physics: Number(row.scores[SubjectCode.Physics]),
        chemistry: Number(row.scores[SubjectCode.Chemistry]),
        total: Number(row.total),
      })),
    };
  }
}
