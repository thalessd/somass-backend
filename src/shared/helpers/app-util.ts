import {
  addDays,
  addWeeks,
  format,
  isAfter,
  parse,
  startOfWeek,
  getDay,
  subDays,
} from 'date-fns';
import { DayOfWeek } from '../../event/enum/day-of-week.enum';
import { Client } from '../../clients/entities/client.entity';
import { SimpleClient } from '../../clients/models/simple-client';
import { ClientEscort } from '../../clients/entities/client-escort.entity';

export class AppUtil {
  static getFullDateTimeFromOneWeekDay(dayOfWeek: DayOfWeek): Date {
    const currentDayOfWeek = getDay(new Date());

    if (dayOfWeek !== DayOfWeek.Sunday) {
      return addDays(
        startOfWeek(
          currentDayOfWeek === 0 ? subDays(new Date(), 1) : new Date(),
        ),
        dayOfWeek,
      );
    }

    // Se o dia que o cadastro está sendo feito for o
    // domingo ele pega o dia atual
    if (currentDayOfWeek === 0) {
      return new Date();
    }

    return addWeeks(startOfWeek(new Date()), 1);
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

  static mondayOfWeekStr(): string {
    return format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
  }

  static calcOccupiedVacancies(peoplePerClient: number[]): number {
    return peoplePerClient.length > 0
      ? peoplePerClient.reduce((tot, num) => tot + num)
      : 0;
  }
}
