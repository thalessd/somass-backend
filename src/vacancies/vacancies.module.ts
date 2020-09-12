import { Module } from '@nestjs/common';
import { VacanciesService } from './vacancies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vacancy } from './vacancy.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vacancy])],
  providers: [VacanciesService],
  exports: [VacanciesService],
})
export class VacanciesModule {}
