import { ApiProperty } from '@nestjs/swagger';
import { SubjectCode } from '../../subjects/domain/subject-code.enum';

export enum DistributionBandKey {
  GreaterThanOrEqualEight = 'gte_8',
  GreaterThanOrEqualSixLessThanEight = 'gte_6_lt_8',
  GreaterThanOrEqualFourLessThanSix = 'gte_4_lt_6',
  LessThanFour = 'lt_4',
}

export class DistributionBandDto {
  @ApiProperty({ enum: DistributionBandKey, example: 'gte_8' })
  key!: DistributionBandKey;

  @ApiProperty({ example: '>= 8' })
  label!: string;

  @ApiProperty({ example: 250000 })
  count!: number;
}

export class SubjectDistributionDto {
  @ApiProperty({ enum: SubjectCode, example: SubjectCode.Math })
  subjectCode!: SubjectCode;

  @ApiProperty({ example: 'Toán' })
  subjectName!: string;

  @ApiProperty({ example: 1045613 })
  totalWithScore!: number;

  @ApiProperty({ type: [DistributionBandDto] })
  bands!: DistributionBandDto[];
}

export class ScoreDistributionDataDto {
  @ApiProperty({ type: [SubjectDistributionDto] })
  subjects!: SubjectDistributionDto[];
}

export class ScoreDistributionResponseDto {
  @ApiProperty({ type: ScoreDistributionDataDto })
  data!: ScoreDistributionDataDto;

  @ApiProperty({ example: {} })
  meta!: Record<string, never>;
}
