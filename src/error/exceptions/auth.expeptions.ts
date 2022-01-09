export const AuthErrorNames = {
  INCORRECT_PASSWORD: {
    message: 'Incorrect password',
    code: 'INCORRECT_PASSWORD',
  },
  INCORRECT_USER_PASSWORD: {
    code: 'INCORRECT_USER_PASSWORD',
    message: 'Incorrect user or password',
  },
  USER_REGISTRATION: {
    code: 'USER_REGISTRATION',
    message: 'Can not register this user',
  },
  ENCRYPTION_ERROR: {
    code: 'ENCRYPTION_ERROR',
    message: 'Error while encripting user',
  },
  RANDOM_TOKEN: {
    code: 'RANDOM_TOKEN',
    message: 'Error getting token',
  },
  EXPIRED_TOKEN: {
    code: 'EXPIRED_TOKEN',
    message: 'Expired token',
  },
};
