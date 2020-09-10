import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let errorResponse = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: ['Internal server error'],
      error: 'Internal Server Error',
    };

    if (exception instanceof HttpException) {
      const messageIsString =
        typeof exception.getResponse()['message'] === 'string';

      // Serve para padronizar os erros;
      errorResponse = {
        statusCode: exception.getStatus(),
        message: messageIsString
          ? [exception.getResponse()['message']]
          : exception.getResponse()['message'],
        error:
          messageIsString && !exception.getResponse()['error']
            ? exception.getResponse()['message']
            : exception.getResponse()['error'],
      };
    }

    if (exception instanceof EntityNotFoundError) {
      errorResponse = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['Could not find the entity'],
        error: 'Entity Not Found',
      };
    }

    if (exception['code'] === '23505') {
      errorResponse = {
        statusCode: HttpStatus.CONFLICT,
        message: ['Value in conflict'],
        error: 'Conflict',
      };
    }

    if (exception['code'] === '23503') {
      errorResponse = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['Value in Use'],
        error: 'In Use',
      };
    }

    if (exception['code'] === '22P02') {
      errorResponse = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['UUID invalid input'],
        error: 'UUID Invalid',
      };
    }

    if (exception['code'] === '22008') {
      errorResponse = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['Date/time field value out of range'],
        error: 'DATE/TIME Out of Range',
      };
    }

    if (exception['code'] === 'NotFound') {
      errorResponse = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['File not found'],
        error: 'File Not Found',
      };
    }

    if (errorResponse.statusCode === 500)
      console.error('Internal Error: ', exception);

    response.status(errorResponse.statusCode).json(errorResponse);
  }
}
