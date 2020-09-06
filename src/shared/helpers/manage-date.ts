import { addMinutes, subMinutes, format, toDate, formatISO } from 'date-fns';

export class ManageDate {
  static stringDateTime(date: Date): string {
    return format(new Date(date), 'dd/MM/yyyy HH:mm:ss');
  }

  static localToGlobal(date: Date): Date {
    return toDate(addMinutes(date, date.getTimezoneOffset()));
  }

  static globalToLocal(date: Date): Date {
    return toDate(subMinutes(date, date.getTimezoneOffset()));
  }

  static toISODate(date: Date): Date {
    return new Date(formatISO(date));
  }
}
