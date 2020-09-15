import { DayOfWeek } from '../enum/day-of-week.enum';

export class PublicEvent {
  id: string;
  location: string;
  date: Date;
  dayOfWeek: DayOfWeek;
  totalVacancies: number;
  occupiedVacancies: number;
  hasParticipation: boolean;
  hasPassed: boolean;
}
