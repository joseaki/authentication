import { Injectable } from '@nestjs/common';
import { SQLErrors, SQLErrorsOther } from 'src/users/errors';

@Injectable()
export class ErrorService {
  getErrorMessage(error: Record<string, any>, override?: string) {
    if (!override) {
      if (error.sqlState) {
        return SQLErrors[error.code];
      } else if (error.name === 'EntityNotFound') {
        return SQLErrorsOther.NOT_FOUND;
      } else if (error.name === 'EntityNotFound') {
        return SQLErrorsOther.NOT_FOUND;
      } else {
        return 'Error desconocido';
      }
    } else {
      if (override === 'token_error') {
        return SQLErrorsOther.TOKEN_NOT_FOUND;
      }
    }
  }
}
