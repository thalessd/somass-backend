import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vacancy } from './vacancy.entity';
import { SubscribeDto } from './dto/subscribe.dto';
import { ClientsService } from '../clients/clients.service';
import { EventsService } from '../event/events.service';
import { format, startOfWeek } from 'date-fns';
import { AppUtil } from '../shared/helpers/app-util';
import {
  EventDateHasPassedException,
  NoVacancyException,
} from '../shared/helpers/custom-exception';
import { Event } from '../event/event.entity';
import { MoreThanOrEqual } from 'typeorm';
import { UnsubscribeDto } from './dto/unsubscribe.dto';
import { SimpleVacancy } from './models/SimpleVacancy';
import { SimpleClient } from '../clients/models/SimpleClient';
import { ClientEscort } from '../clients/entities/client-escort.entity';

@Injectable()
export class VacanciesService {
  constructor(
    @InjectRepository(Vacancy)
    private readonly vacancyRepository: Repository<Vacancy>,
    private clientsService: ClientsService,
    @Inject(forwardRef(() => EventsService))
    private eventsService: EventsService,
  ) {}

  private static getMondayOfWeekStr(): string {
    return format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
  }

  async getVacancyCount(event: Event): Promise<number> {
    const lessDateOfWeek = VacanciesService.getMondayOfWeekStr();

    const vacancies = await this.vacancyRepository.find({
      where: { event, dateWasSet: MoreThanOrEqual(lessDateOfWeek) },
      select: ['id'],
      relations: ['client'],
    });

    const peoplePerClient = vacancies.map<number>((data: Partial<Vacancy>) =>
      AppUtil.countClientPeoples(data.client),
    );

    return peoplePerClient.length > 0
      ? peoplePerClient.reduce((tot, num) => tot + num)
      : 0;
  }

  async subscribe(token: string, subscribeDto: SubscribeDto): Promise<void> {
    const clientFound = await this.clientsService.findOneByToken(token);
    const eventFound = await this.eventsService.findOne(subscribeDto.eventId);

    const ocupiedSlots = await this.getVacancyCount(eventFound);

    const currentClientAndScortsQty = AppUtil.countClientPeoples(clientFound);

    if (ocupiedSlots + currentClientAndScortsQty > eventFound.vacancy) {
      throw new NoVacancyException();
    }

    const { dayOfWeek, startTime } = eventFound;

    const vacancyDate = AppUtil.getFullDateTimeFromOneWeekDay(dayOfWeek);

    if (!AppUtil.testEventDateTimeIsAfterDateTime(startTime, dayOfWeek)) {
      throw new EventDateHasPassedException();
    }

    const vacancy = new Vacancy();

    vacancy.client = clientFound;
    vacancy.event = eventFound;
    vacancy.dateWasSet = format(vacancyDate, 'yyyy-MM-dd');

    await this.vacancyRepository.save(vacancy);
  }

  async unsubscribe(
    token: string,
    unsubscribeDto: UnsubscribeDto,
  ): Promise<void> {
    const clientFound = await this.clientsService.findOneByToken(token);
    const eventFound = await this.eventsService.findOne(unsubscribeDto.eventId);

    const lessDateOfWeek = VacanciesService.getMondayOfWeekStr();

    const { dayOfWeek, startTime } = eventFound;

    if (!AppUtil.testEventDateTimeIsAfterDateTime(startTime, dayOfWeek)) {
      throw new EventDateHasPassedException();
    }

    await this.vacancyRepository.delete({
      event: eventFound,
      dateWasSet: MoreThanOrEqual(lessDateOfWeek),
      client: clientFound,
    });
  }

  async getAllSimpleVacancies(eventId: string): Promise<SimpleVacancy[]> {
    const lessDateOfWeek = VacanciesService.getMondayOfWeekStr();

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
}
