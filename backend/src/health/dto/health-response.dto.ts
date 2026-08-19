import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
  @ApiProperty({ example: 'ok' })
  status!: 'ok';

  @ApiProperty({ example: 'g-scores-backend' })
  service!: string;

  @ApiProperty({ example: 'up' })
  database!: 'up';
}
