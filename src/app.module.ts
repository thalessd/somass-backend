import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtBlacklist } from './auth/jwt-blacklist.entity';
import { EventsModule } from './event/events.module';
import { Event } from './event/event.entity';
import { VacanciesModule } from './vacancies/vacancies.module';
import { ClientsModule } from './clients/clients.module';
import { Client } from './clients/entities/client.entity';
import { Vacancy } from './vacancies/vacancy.entity';
import { ClientEscort } from './clients/entities/client-escort.entity';
import { DeviceInfo } from './clients/entities/device-info.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [
          JwtBlacklist,
          User,
          Event,
          ClientEscort,
          DeviceInfo,
          Client,
          Vacancy,
        ],
        synchronize: true,
      }),
    }),
    UsersModule,
    AuthModule,
    EventsModule,
    VacanciesModule,
    ClientsModule,
  ],
})
export class AppModule {}
