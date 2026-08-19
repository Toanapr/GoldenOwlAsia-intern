import { ApiProperty } from '@nestjs/swagger';
import { SubjectCode } from '../../subjects/domain/subject-code.enum';

export class SubjectGroupDto {
  @ApiProperty({ example: 'A' })
  code!: string;

  @ApiProperty({
    enum: SubjectCode,
    isArray: true,
    example: [SubjectCode.Math, SubjectCode.Physics, SubjectCode.Chemistry],
  })
  subjects!: SubjectCode[];
}

export class GroupAStudentDto {
  @ApiProperty({ example: 1 })
  position!: number;

  @ApiProperty({ example: '26020938' })
  registrationNumber!: string;

  @ApiProperty({ example: 9.6 })
  math!: number;

  @ApiProperty({ example: 10 })
  physics!: number;

  @ApiProperty({ example: 10 })
  chemistry!: number;

  @ApiProperty({ example: 29.6 })
  total!: number;
}

export class TopGroupADataDto {
  @ApiProperty({ type: SubjectGroupDto })
  group!: SubjectGroupDto;

  @ApiProperty({ type: [GroupAStudentDto] })
  students!: GroupAStudentDto[];
}

export class TopGroupAResponseDto {
  @ApiProperty({ type: TopGroupADataDto })
  data!: TopGroupADataDto;

  @ApiProperty({ example: {} })
  meta!: Record<string, never>;
}
