import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ExceptionError } from 'common/interfaces/IErrors';
import { SQLErrors } from './exceptions/sql.exception';

@Injectable()
export class ErrorService {
  getErrorMessage(error: Record<string, any>, override?: string) {
    console.log(error);
    if (!override) {
      if (error.name === 'EntityNotFound') {
        return SQLErrors.NOT_FOUND;
      } else if (error.name === 'EntityNotFound') {
        return SQLErrors.NOT_FOUND;
      } else if (error.driverError.constraint === 'UNQ_USER') {
        return SQLErrors.UNQ_USER;
      } else {
        return { message: 'Unknown error', code: 'UNKNOWN' };
      }
    } else {
      if (override === 'token_error') {
        return SQLErrors.TOKEN_NOT_FOUND;
      }
    }
  }

  getException(errorMessage: ExceptionError, error?: string) {
    console.trace('ERROR ERROR');
    return new UnprocessableEntityException(
      [
        {
          constraints: [errorMessage.message],
          codes: [errorMessage.code],
        },
      ],
      error ?? errorMessage.message,
    );
  }
}
