import { Module } from '@nestjs/common';
import { VacanciesService } from './vacancies.service';
import { VacanciesController } from './vacancies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vacancy } from './vacancy.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vacancy])],
  providers: [VacanciesService],
  controllers: [VacanciesController],
})
export class VacanciesModule {}
