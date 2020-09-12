import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/enum/role.enum';
import { CreateEventDto } from './dto/create-event.dto';
import { EventsService } from './events.service';
import { Event } from './event.entity';
import { UpdateEventDto } from './dto/update-event.dto';
import { SimpleEvent } from './models/SimpleEvent';

@Controller('event')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @Roles(Role.Admin)
  create(
    @Request() request: any,
    @Body() createEventDto: CreateEventDto,
  ): Promise<Event> {
    const userId = request.user.id;

    return this.eventsService.create(createEventDto, userId);
  }

  @Get('grouped')
  @Roles(Role.Admin)
  findAllSimpleEvents(): Promise<SimpleEvent[]> {
    return this.eventsService.findAllWithVacancies();
  }

  @Get(':id')
  @Roles(Role.Admin)
  findOne(@Param('id') id: string): Promise<Event> {
    return this.eventsService.findOne(id);
  }

  @Get()
  @Roles(Role.Admin)
  findAll(): Promise<Event[]> {
    return this.eventsService.findAll();
  }

  @Put(':id')
  @Roles(Role.Admin)
  update(
    @Request() request: any,
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    const userId = request.user.id;

    return this.eventsService.update(id, updateEventDto, userId);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id') id: string): Promise<void> {
    return this.eventsService.remove(id);
  }
}
