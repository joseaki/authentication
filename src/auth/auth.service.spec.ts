import * as bcrypt from 'bcrypt';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import JWT from 'src/config/jwt.config';
import { MailerModule } from 'src/mailer/mailer.module';
import { MailService } from 'src/mailer/mailer.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import UserErrorNames from 'src/users/errors';
import AuthErrorNames from './errors';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UsersService;

  const userEmail = 'johddn@doe.com';
  const userPassword = 'admin';
  const clientId = 1;
  const userData: User = {
    id: 72,
    password: '',
    isActive: true,
    isArchived: false,
    createdAt: new Date('2021-06-01T01:35:07.708Z'),
    createdBy: '',
    updatedAt: new Date('2021-06-01T01:36:08.000Z'),
    updatedBy: '',
    deletedAt: null,
    deletedBy: null,
    internalComment: null,
    isComplete: false,
    email: userEmail,
    clientId: clientId,
    username: '',
    name: '',
    lastname: '',
    displayname: '',
    birthday: null,
    gender: '',
    district: '',
    address: '',
    postCode: '',
    telephone: '',
    lastLogin: null,
    lastLoginIP: '',
    registeredIP: '',
    restorePasswordToken: 'dddddddddddddddddddddddddddd',
    restorePasswordDate: new Date('2021-06-01T01:36:08.000Z'),
    isValidPasswordToken: true,
    refreshToken: 'eeeeeeeeeeeeeeeeeeeeeeeeeee',
    refreshTokenEmitDate: new Date('2021-06-01T01:35:59.000Z'),
  };

  const userDataNoPassword: Partial<User> = {
    id: 72,
    password: '',
    isActive: true,
    isArchived: false,
    createdAt: new Date('2021-06-01T01:35:07.708Z'),
    createdBy: '',
    updatedAt: new Date('2021-06-01T01:36:08.000Z'),
    updatedBy: '',
    deletedAt: null,
    deletedBy: null,
    internalComment: null,
    isComplete: false,
    email: userEmail,
    clientId: clientId,
    username: '',
    name: '',
    lastname: '',
    displayname: '',
    birthday: null,
    gender: '',
    district: '',
    address: '',
    postCode: '',
    telephone: '',
    lastLogin: null,
    lastLoginIP: '',
    registeredIP: '',
    restorePasswordToken: 'dddddddddddddddddddddddddddd',
    restorePasswordDate: new Date('2021-06-01T01:36:08.000Z'),
    isValidPasswordToken: true,
    refreshToken: 'eeeeeeeeeeeeeeeeeeeeeeeeeee',
    refreshTokenEmitDate: new Date('2021-06-01T01:35:59.000Z'),
  };

  beforeAll(async () => {
    const encriptedPassword = await bcrypt.hash(userPassword, 12);
    userData.password = encriptedPassword;
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: JWT.jwtSecret,
          signOptions: { expiresIn: '60s' },
        }),
        MailerModule,
        PassportModule,
      ],
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findPasswordByEmail: jest.fn().mockResolvedValue(userData),
            saveUserRegistration: jest.fn().mockReturnValue(userData),
            update: jest.fn().mockReturnValue({}),
            findByEmail: jest.fn().mockResolvedValue(userData),
            saveRestorePasswordToken: jest.fn().mockResolvedValue({}),
            updatePassword: jest.fn().mockResolvedValue({}),
            findByRestoreToken: jest.fn().mockResolvedValue(userData),
          },
        },
      ],
    }).compile();
    authService = module.get<AuthService>(AuthService);
    userService = await module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('Validate user', () => {
    it('should validate if user and password is correct exists', async () => {
      const { password, ...rest } = userData;
      await expect(
        authService.validateUser(userEmail, userPassword, clientId),
      ).resolves.toEqual(rest);
      expect(userService.findPasswordByEmail).toBeCalledTimes(1);
      expect(userService.findPasswordByEmail).toBeCalledWith(
        userEmail,
        clientId,
      );
    });

    it('should throw an error if user does not exists', async () => {
      const falseEmail = 'falseEmail';
      const findPasswordByEmail = jest
        .spyOn(userService, 'findPasswordByEmail')
        .mockRejectedValueOnce(UserErrorNames);
      await expect(
        authService.validateUser(falseEmail, userPassword, clientId),
      ).rejects.toEqual(AuthErrorNames.INCORRECT_USER_PASSWORD);
      expect(findPasswordByEmail).toBeCalledTimes(1);
      expect(findPasswordByEmail).toBeCalledWith(falseEmail, clientId);
    });

    it('should throw an error if password does not exits', async () => {
      const falsePassword = 'falsePassword';
      await expect(
        authService.validateUser(userEmail, falsePassword, clientId),
      ).rejects.toEqual(AuthErrorNames.INCORRECT_PASSWORD);
      expect(userService.findPasswordByEmail).toBeCalledTimes(1);
      expect(userService.findPasswordByEmail).toBeCalledWith(
        userEmail,
        clientId,
      );
    });
  });

  describe('user registration', () => {
    test('should register new user', async () => {
      const userToBeSaved = { email: userEmail, password: userPassword };
      await expect(
        authService.register(userToBeSaved, clientId),
      ).resolves.toEqual(userData);

      expect(userService.saveUserRegistration).toHaveBeenCalledTimes(1);
      expect(userService.saveUserRegistration).toHaveBeenCalledWith(
        userToBeSaved,
      );
    });

    test('should throw an error when registering', async () => {
      const saveUserRegistration = jest
        .spyOn(userService, 'saveUserRegistration')
        .mockRejectedValueOnce(new Error());
      const userToBeSaved = { email: userEmail, password: userPassword };
      await expect(
        authService.register(userToBeSaved, clientId),
      ).rejects.toEqual(AuthErrorNames.USER_REGISTRATION);
      expect(saveUserRegistration).toHaveBeenCalledTimes(1);
      expect(saveUserRegistration).toHaveBeenCalledWith(userToBeSaved);
    });
  });
});
