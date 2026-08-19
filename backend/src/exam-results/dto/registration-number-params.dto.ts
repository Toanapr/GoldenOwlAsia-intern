import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';

export class RegistrationNumberParamsDto {
  @ApiProperty({ example: '01000001', pattern: '^\\d{8}$' })
  @Matches(/^\d{8}$/, {
    message: 'Registration number must contain exactly 8 digits',
  })
  registrationNumber!: string;
}
