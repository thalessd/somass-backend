import { SimpleVacancy } from '../../vacancies/models/SimpleVacancy';

export class SimpleEvent {
  id: string;
  location: string;
  date: Date;
  totalVacancies: number;
  occupiedVacancies: number;
  simpleVacancy: SimpleVacancy[];
}
