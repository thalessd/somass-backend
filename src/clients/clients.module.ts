import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { ClientEscort } from './entities/client-escort.entity';
import { DeviceInfo } from './entities/device-info.entity';
import { EventsModule } from '../event/events.module';
import { VacanciesModule } from '../vacancies/vacancies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DeviceInfo, ClientEscort, Client]),
    EventsModule,
    VacanciesModule,
  ],
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}
