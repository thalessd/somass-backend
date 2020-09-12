import { parse, addDays, startOfWeek, isAfter } from 'date-fns';
import { DayOfWeek } from '../../event/enum/day-of-week.enum';
import { Client } from '../../clients/entities/client.entity';
import { SimpleClient } from '../../clients/models/SimpleClient';
import { ClientEscort } from '../../clients/entities/client-escort.entity';

export class AppUtil {
  static getFullDateTimeFromOneWeekDay(dayOfWeek: DayOfWeek): Date {
    return addDays(startOfWeek(new Date()), dayOfWeek);
  }

  static getEventDateTime(
    eventStartTime: string,
    eventDayOfWeek: DayOfWeek,
  ): Date {
    const fullDateTimeFromOneWeekDay = this.getFullDateTimeFromOneWeekDay(
      eventDayOfWeek,
    );

    return parse(eventStartTime, 'HH:mm:ss', fullDateTimeFromOneWeekDay);
  }

  static testEventDateTimeIsAfterDateTime(
    eventStartTime: string,
    eventDayOfWeek: DayOfWeek,
    dateTimeToTest: Date = new Date(),
  ): boolean {
    const eventDateTime = this.getEventDateTime(eventStartTime, eventDayOfWeek);

    return isAfter(eventDateTime, dateTimeToTest);
  }

  static countClientPeoples(client: Client): number {
    return client.escorts.length + (client.fullName !== '' ? 1 : 0);
  }

  static countSimpleClientPeoples(simpleClient: SimpleClient): number {
    const client = new Client();
    client.fullName = simpleClient.nameOfMain;

    client.escorts = simpleClient.escortNames.map<ClientEscort>(
      (name: string) => {
        const clientEscort = new ClientEscort();
        clientEscort.fullName = name;
        return clientEscort;
      },
    );

    return this.countClientPeoples(client);
  }
}
