import { Event } from '../../event/event.entity';

export class RequestedVacancy {
  id: string;
  dateWasSet: string;
  event: Event;
  createdAt: Date;
}
