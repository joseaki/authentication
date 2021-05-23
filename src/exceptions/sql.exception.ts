import { HttpException, HttpStatus } from '@nestjs/common';

export class SqlException extends HttpException {
  constructor(errorObject?: any) {
    super(SqlErrorObj.getErrorObject(errorObject), HttpStatus.CONFLICT);
  }
}

interface ISqlError {
  statusCode: number;
  errorCode: string;
  message: string;
}

class SqlErrorObj {
  static getErrorObject(errorObject?: any): ISqlError {
    const errorCode = this.getErrorCode(errorObject);
    const errorMessage = this.getErrorMessage(errorObject);
    return {
      statusCode: HttpStatus.CONFLICT,
      errorCode: errorCode,
      message: errorMessage,
    };
  }

  private static getErrorMessage(errorObject?: any) {
    if (!errorObject) {
      return 'sql error';
    }
    if (!errorObject.code) {
      if (errorObject.name) {
        switch (errorObject.name) {
          case 'EntityNotFound':
            return 'Not found';
          default:
            return 'Unknown error';
        }
      } else {
        return 'sql error (no name)';
      }
    }
    const { code } = errorObject;
    switch (code) {
      case 'ER_DUP_ENTRY':
        return 'User already registered';
      default:
        return 'Unmapped error';
    }
  }

  private static getErrorCode(errorObject?: any) {
    if (!errorObject) {
      return 'NO_CODE';
    }
    if (!errorObject.code) {
      if (errorObject.name) {
        return errorObject.name;
      } else {
        return 'NO_CODE_NAME';
      }
    }
    return errorObject.code;
  }
}
