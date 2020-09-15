import { SimpleVacancy } from '../../vacancies/models/simple-vacancy';

export class SimpleEvent {
  id: string;
  location: string;
  date: Date;
  totalVacancies: number;
  occupiedVacancies: number;
  simpleVacancy: SimpleVacancy[];
}
