import { HttpException, HttpStatus } from '@nestjs/common';

export class EventDateHasPassedException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.FORBIDDEN,
        message: 'Event date has passed',
        error: 'Date Has Passed',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}

export class NoVacancyException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.FORBIDDEN,
        message: 'No vacancy available',
        error: 'No Vacancy',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
