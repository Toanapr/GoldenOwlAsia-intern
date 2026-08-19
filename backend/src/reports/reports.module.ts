import { Module } from '@nestjs/common';
import { SubjectsModule } from '../subjects/subjects.module';
import { ReportsController } from './reports.controller';
import { ReportsQueryService } from './reports-query.service';
import { ReportsService } from './reports.service';

@Module({
  imports: [SubjectsModule],
  controllers: [ReportsController],
  providers: [ReportsQueryService, ReportsService],
})
export class ReportsModule {}
