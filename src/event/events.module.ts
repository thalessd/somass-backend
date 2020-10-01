import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { UsersModule } from '../users/users.module';
import { VacanciesModule } from '../vacancies/vacancies.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Event]), UsersModule, VacanciesModule],
  providers: [EventsService],
  controllers: [EventsController],
  exports: [EventsService],
})
export class EventsModule {}
