import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, FindConditions, Repository } from 'typeorm';
import { Vacancy } from './vacancy.entity';
import { AppUtil } from '../shared/helpers/app-util';
import { Event } from '../event/event.entity';
import { MoreThanOrEqual } from 'typeorm';
import { SimpleVacancy } from './models/SimpleVacancy';
import { SimpleClient } from '../clients/models/SimpleClient';
import { ClientEscort } from '../clients/entities/client-escort.entity';
import { Client } from '../clients/entities/client.entity';
import { RequestedVacancy } from './models/RequestedVacancy';

@Injectable()
export class VacanciesService {
  constructor(
    @InjectRepository(Vacancy)
    private readonly vacancyRepository: Repository<Vacancy>,
  ) {}

  async getVacancyCount(event: Event): Promise<number> {
    const lessDateOfWeek = AppUtil.mondayOfWeekStr();

    const vacancies = await this.vacancyRepository.find({
      where: { event, dateWasSet: MoreThanOrEqual(lessDateOfWeek) },
      select: ['id'],
      relations: ['client'],
    });

    const peoplePerClient = vacancies.map<number>((data: Partial<Vacancy>) =>
      AppUtil.countClientPeoples(data.client),
    );

    return AppUtil.calcOccupiedVacancies(peoplePerClient);
  }

  async getAllSimpleVacancies(eventId: string): Promise<SimpleVacancy[]> {
    const lessDateOfWeek = AppUtil.mondayOfWeekStr();

    const partialVacancies: Partial<
      Vacancy
    >[] = await this.vacancyRepository.find({
      where: {
        event: eventId,
        dateWasSet: MoreThanOrEqual(lessDateOfWeek),
      },
      select: ['id', 'client', 'dateWasSet', 'createdAt'],
      relations: ['client'],
    });

    return partialVacancies.map<SimpleVacancy>((data: Partial<Vacancy>) => {
      const simpleClient = new SimpleClient();

      simpleClient.id = data.client.id;
      simpleClient.nameOfMain = data.client.fullName;
      simpleClient.escortNames = data.client.escorts.map<string>(
        (escort: ClientEscort) => escort.fullName,
      );

      const simpleVacancie = new SimpleVacancy();

      simpleVacancie.id = data.id;
      simpleVacancie.dateWasSet = data.dateWasSet;
      simpleVacancie.createdAt = data.createdAt;

      simpleVacancie.simpleClient = simpleClient;

      return simpleVacancie;
    });
  }

  async saveEntity(vacancy: Vacancy): Promise<Vacancy> {
    return this.vacancyRepository.save(vacancy);
  }

  async deleteEntity(criteria: FindConditions<Vacancy>): Promise<DeleteResult> {
    return this.vacancyRepository.delete(criteria);
  }

  async requested(client: Client): Promise<RequestedVacancy[]> {
    const lessDateOfWeek = AppUtil.mondayOfWeekStr();

    const partialVacancies: Partial<
      Vacancy
    >[] = await this.vacancyRepository.find({
      where: {
        client,
        dateWasSet: MoreThanOrEqual(lessDateOfWeek),
      },
      select: ['id', 'event', 'dateWasSet', 'createdAt'],
      relations: ['event'],
    });

    return partialVacancies.map<RequestedVacancy>((data: Partial<Vacancy>) => {
      const requestedVacancy = new RequestedVacancy();

      requestedVacancy.id = data.id;
      requestedVacancy.dateWasSet = data.dateWasSet;
      requestedVacancy.createdAt = data.createdAt;
      requestedVacancy.event = data.event;

      return requestedVacancy;
    });
  }
}
