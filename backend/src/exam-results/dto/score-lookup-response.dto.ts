import { ApiProperty } from '@nestjs/swagger';
import { SubjectCode } from '../../subjects/domain/subject-code.enum';

export class SubjectScoreDto {
  @ApiProperty({ enum: SubjectCode, example: SubjectCode.Math })
  subjectCode!: SubjectCode;

  @ApiProperty({ example: 'Toán' })
  subjectName!: string;

  @ApiProperty({ example: 8.4, nullable: true, type: Number })
  score!: number | null;
}

export class ScoreLookupDataDto {
  @ApiProperty({ example: '01000001' })
  registrationNumber!: string;

  @ApiProperty({ example: 'N1', nullable: true, type: String })
  foreignLanguageCode!: string | null;

  @ApiProperty({ type: [SubjectScoreDto] })
  scores!: SubjectScoreDto[];
}

export class ScoreLookupResponseDto {
  @ApiProperty({ type: ScoreLookupDataDto })
  data!: ScoreLookupDataDto;

  @ApiProperty({ example: {} })
  meta!: Record<string, never>;
}
