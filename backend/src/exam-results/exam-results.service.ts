import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiException } from '../common/http/api.exception';
import { SubjectRegistry } from '../subjects/domain/subject-registry';
import { ScoreLookupDataDto } from './dto/score-lookup-response.dto';
import { ExamResult } from './entities/exam-result.entity';

@Injectable()
export class ExamResultsService {
  constructor(
    @InjectRepository(ExamResult)
    private readonly repository: Repository<ExamResult>,
    private readonly subjectRegistry: SubjectRegistry,
  ) {}

  async findByRegistrationNumber(
    registrationNumber: string,
  ): Promise<ScoreLookupDataDto> {
    const result = await this.repository
      .createQueryBuilder('result')
      .where('result.registration_number = :registrationNumber', {
        registrationNumber,
      })
      .limit(1)
      .getOne();
    if (!result) {
      throw new ApiException(
        HttpStatus.NOT_FOUND,
        'SCORE_NOT_FOUND',
        `No exam result found for registration number ${registrationNumber}`,
      );
    }

    return {
      registrationNumber: result.registrationNumber,
      foreignLanguageCode: result.foreignLanguageCode,
      scores: this.subjectRegistry.getAll().map((subject) => {
        const score = subject.scoreFrom(result);
        return {
          subjectCode: subject.code,
          subjectName: subject.displayName,
          score: score === null ? null : Number(score),
        };
      }),
    };
  }
}
