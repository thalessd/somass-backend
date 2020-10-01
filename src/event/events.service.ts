import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { VacanciesService } from '../vacancies/vacancies.service';
import { SimpleEvent } from './models/simple-event';
import { AppUtil } from '../shared/helpers/app-util';
import { SimpleVacancy } from '../vacancies/models/simple-vacancy';
import { Response } from 'express';
import { ReportPdf } from './helpers/report-pdf';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private usersService: UsersService,
    private vacanciesService: VacanciesService,
    private configService: ConfigService
  ) {}

  async create(createEventDto: CreateEventDto, userId: string): Promise<Event> {
    const user = await this.usersService.findOne(userId);

    const event = new Event();

    event.location = createEventDto.location;
    event.startTime = createEventDto.startTime;
    event.dayOfWeek = createEventDto.dayOfWeek;
    event.vacancy = createEventDto.vacancy;
    event.available = createEventDto.available;
    event.createdBy = user;
    event.updatedBy = null;

    return this.eventRepository.save(event);
  }

  async findOne(id: string): Promise<Event> {
    return this.eventRepository.findOneOrFail(id);
  }

  async findAll(): Promise<Event[]> {
    return this.eventRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findAllAvailable(): Promise<Event[]> {
    return this.eventRepository.find({
      where: { available: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findAllAvailableThin(): Promise<Partial<Event[]>> {
    return this.eventRepository.find({
      where: { available: true },
      select: ['id', 'dayOfWeek', 'startTime'],
    });
  }

  async generateReport(id: string, response: Response): Promise<void> {
    const eventFound = await this.eventRepository.findOneOrFail({
      where: { id },
      select: ['id', 'location', 'startTime', 'dayOfWeek', 'vacancy'],
    });

    const simpleEvent = new SimpleEvent();

    const simpleVacancy = await this.vacanciesService.getAllSimpleVacancies(
      eventFound.id,
    );

    const peoplePerClient = simpleVacancy.map<number>(
      (sVacancy: SimpleVacancy) => {
        return AppUtil.countSimpleClientPeoples(sVacancy.simpleClient);
      },
    );

    const occupiedVacancies = AppUtil.calcOccupiedVacancies(peoplePerClient);

    simpleEvent.id = eventFound.id;
    simpleEvent.location = eventFound.location;
    simpleEvent.date = AppUtil.getEventDateTime(
      eventFound.startTime,
      eventFound.dayOfWeek,
    );
    simpleEvent.totalVacancies = eventFound.vacancy;
    simpleEvent.occupiedVacancies = occupiedVacancies;
    simpleEvent.simpleVacancy = simpleVacancy;

    const eventType = this.configService.get<string>('EVENT_TYPE');

    return ReportPdf.generate(simpleEvent, response, eventType);
  }

  async findAllSimpleEvents(): Promise<SimpleEvent[]> {
    const eventsFounded = await this.eventRepository.find({
      where: { available: true },
      order: { createdAt: 'DESC' },
      select: ['id', 'location', 'startTime', 'dayOfWeek', 'vacancy', 'available'],
    });

    const simpleEventPromises = eventsFounded.map(
      async (data: Partial<Event>) => {
        const simpleEvent = new SimpleEvent();

        const simpleVacancy = await this.vacanciesService.getAllSimpleVacancies(
          data.id,
        );

        const peoplePerClient = simpleVacancy.map<number>(
          (sVacancy: SimpleVacancy) => {
            return AppUtil.countSimpleClientPeoples(sVacancy.simpleClient);
          },
        );

        const occupiedVacancies = AppUtil.calcOccupiedVacancies(
          peoplePerClient,
        );

        simpleEvent.id = data.id;
        simpleEvent.location = data.location;
        simpleEvent.date = AppUtil.getEventDateTime(
          data.startTime,
          data.dayOfWeek,
        );
        simpleEvent.totalVacancies = data.vacancy;
        simpleEvent.occupiedVacancies = occupiedVacancies;
        simpleEvent.simpleVacancy = simpleVacancy;

        return simpleEvent;
      },
    );

    return Promise.all(simpleEventPromises);
  }

  async update(
    id: string,
    updateEventDto: UpdateEventDto,
    userId: string,
  ): Promise<Event> {
    const user = await this.usersService.findOne(userId);
    const eventFound = await this.eventRepository.findOneOrFail(id);

    eventFound.location = updateEventDto.location ?? eventFound.location;
    eventFound.startTime = updateEventDto.startTime ?? eventFound.startTime;
    eventFound.dayOfWeek = updateEventDto.dayOfWeek ?? eventFound.dayOfWeek;
    eventFound.vacancy = updateEventDto.vacancy ?? eventFound.vacancy;
    eventFound.available = updateEventDto.available ?? eventFound.available;
    eventFound.createdBy = user;
    eventFound.updatedBy = user;

    return this.eventRepository.save(eventFound);
  }

  async remove(id: string): Promise<void> {
    await this.eventRepository.delete(id);
  }
}
