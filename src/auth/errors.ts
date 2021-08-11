import { BadRequestException } from '@nestjs/common';

const AuthErrorNames = {
  INCORRECT_PASSWORD: 'Incorrect password',
  INCORRECT_USER_PASSWORD: new BadRequestException(
    'Incorrect user or password',
  ),
  USER_REGISTRATION: new BadRequestException('Can not register this user'),
  ENCRYPTION_ERROR: 'Error while encripting user',
  RANDOM_TOKEN: 'Error getting token',
  EXPIRED_TOKEN: 'Expired token',
};

export default AuthErrorNames;
