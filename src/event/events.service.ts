import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private usersService: UsersService,
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
