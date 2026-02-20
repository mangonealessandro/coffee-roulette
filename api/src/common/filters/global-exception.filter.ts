import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as { message?: string | string[] }).message
            ? Array.isArray((exceptionResponse as { message: string[] }).message)
              ? (exceptionResponse as { message: string[] }).message.join(', ')
              : (exceptionResponse as { message: string }).message
            : message;
    } else if (exception instanceof QueryFailedError) {
      const err = exception as QueryFailedError & { code?: string };
      if (err.message.includes('UNIQUE constraint failed')) {
        status = HttpStatus.CONFLICT;
        if (err.message.includes('users.email')) {
          message = 'Email already in use';
        } else {
          message = 'Duplicate entry';
        }
      } else {
        this.logger.error('Database error:', exception);
      }
    } else {
      this.logger.error('Unhandled exception:', exception);
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
