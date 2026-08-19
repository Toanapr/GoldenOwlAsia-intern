import { ApiProperty } from '@nestjs/swagger';

export class ApiErrorResponseDto {
  @ApiProperty({ example: 400 })
  statusCode!: number;

  @ApiProperty({ example: 'VALIDATION_ERROR' })
  code!: string;

  @ApiProperty({
    example: 'Registration number must contain exactly 8 digits',
  })
  message!: string;

  @ApiProperty({ type: [String], example: [] })
  details!: unknown[];

  @ApiProperty({ example: '/api/v1/scores/abc' })
  path!: string;

  @ApiProperty({ example: '2026-08-19T10:00:00.000Z' })
  timestamp!: string;
}
