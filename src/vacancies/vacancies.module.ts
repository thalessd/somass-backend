import { forwardRef, Module } from '@nestjs/common';
import { VacanciesService } from './vacancies.service';
import { VacanciesController } from './vacancies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vacancy } from './vacancy.entity';
import { ClientsModule } from '../clients/clients.module';
import { EventsModule } from '../event/events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vacancy]),
    ClientsModule,
    forwardRef(() => EventsModule),
  ],
  providers: [VacanciesService],
  controllers: [VacanciesController],
  exports: [VacanciesService],
})
export class VacanciesModule {}
