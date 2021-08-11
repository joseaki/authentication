import { NotAcceptableException } from '@nestjs/common';

const UserErrorNames = {
  USER_REGISTERED: new NotAcceptableException('User already registered'),
  USER_UPDATE: new NotAcceptableException("Can't update user"),
  USER_EMAIL_NOT_EXISTS: 'Email does not exists',
  USER_NOT_EXISTS: new NotAcceptableException('Email does not exists'),
  USER_UPDATE_PASSWORD: new NotAcceptableException(
    "Can't update user password",
  ),
  USER_UPDATE_RESTORE_TOKEN: new NotAcceptableException(
    "Can'T set restore token password",
  ),
};

export const SQLErrors = {
  ER_DUP_ENTRY: 'User already registered',
};

export const SQLErrorsOther = {
  NOT_FOUND: 'User not found',
  TOKEN_NOT_FOUND: 'Token expired or non existant',
};

export default UserErrorNames;
