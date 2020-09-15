import { SimpleClient } from '../../clients/models/simple-client';

export class SimpleVacancy {
  id: string;
  dateWasSet: string;
  simpleClient: SimpleClient;
  createdAt: Date;
}
