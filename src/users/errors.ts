import { NotAcceptableException } from '@nestjs/common';

const ErrorNames = {
  USER_REGISTERED: new NotAcceptableException('User already registered'),
  USER_UPDATE: new NotAcceptableException("Can't update user"),
  USER_EMAIL_NOT_EXISTS: new NotAcceptableException('Email does not exists'),
  USER_NOT_EXISTS: new NotAcceptableException('Email does not exists'),
  USER_UPDATE_PASSWORD: new NotAcceptableException(
    "Can't update user password",
  ),
  USER_UPDATE_RESTORE_TOKEN: new NotAcceptableException(
    "Can'T set restore token password",
  ),
};

export default ErrorNames;
