import { NotAcceptableException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { IUserCompleteRegistration } from 'interfaces/IUser';
import { User } from './entities/user.entity';
import UserErrorNames from './errors';
import { UserRepository } from './repository/user.repository';
import { UsersService } from './users.service';

const userId = 1;
const clientId = 1;
const userEmail = 'email@test.com';
const restorePasswordToken = 'restorePasswordToken';

const oneUser: Partial<User> = {
  id: userId,
  address: '',
  birthday: new Date(),
  clientId: clientId,
  displayname: '',
};

const userRegistration: IUserCompleteRegistration = {
  clientId: clientId,
  email: userEmail,
  password: 'password',
};

const returnedUserValue: Partial<User> = {
  email: userEmail,
  clientId: clientId,
  deletedAt: null,
  deletedBy: null,
  internalComment: null,
  id: userId,
  isActive: true,
  isArchived: false,
  createdAt: new Date('2021-05-31T00:26:53.200Z'),
  updatedAt: new Date('2021-05-31T00:26:53.200Z'),
  isComplete: false,
  isValidPasswordToken: false,
};

const userWithPassword: Partial<User> = {
  name: 'test',
  lastname: 'test',
  id: userId,
  email: userEmail,
  clientId: clientId,
  username: 'testname',
  password: 'encriptedPassword',
};

const updateUserValue: Partial<User> = {
  deletedBy: null,
  internalComment: null,
  name: 'test user',
  lastname: 'last name',
  isActive: false,
  isArchived: false,
  isComplete: true,
  isValidPasswordToken: false,
};

const userDataRestoreToken: Partial<User> = {
  name: 'test',
  lastname: 'test',
  id: userId,
  email: userEmail,
  clientId: clientId,
  username: 'testname',
  restorePasswordDate: new Date('2021-05-31T00:26:53.200Z'),
};

const userUpdatePassword: Partial<User> = {
  id: userId,
  password: 'newencriptedPassword',
};

describe('UsersService', () => {
  let userService: UsersService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserRepository,
          // define all the methods that you use from the catRepo
          // give proper return values as expected or mock implementations, your choice
          useValue: {
            findOneOrFail: jest.fn().mockResolvedValue(oneUser),
            create: jest.fn().mockReturnValue(oneUser),
            save: jest.fn().mockReturnValue(returnedUserValue),
            // as these do not actually use their return values in our sample
            // we just make sure that their resolve is true to not crash
            update: jest.fn().mockResolvedValue(true),
            // as these do not actually use their return values in our sample
            // we just make sure that their resolve is true to not crash
            delete: jest.fn().mockResolvedValue(true),
            findDelicateUserData: jest.fn().mockResolvedValue(userWithPassword),
            findUserData: jest.fn().mockResolvedValue(returnedUserValue),
            findByRestorePasswordToken: jest.fn().mockResolvedValue(userDataRestoreToken),
          },
        },
      ],
    }).compile();

    userService = await module.get<UsersService>(UsersService);
    userRepository = await module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('User register', () => {
    it('should save user registration', async () => {
      await expect(userService.saveUserRegistration(userRegistration)).resolves.toEqual(
        returnedUserValue,
      );
      expect(userRepository.save).toBeCalledTimes(1);
      expect(userRepository.save).toBeCalledWith(userRegistration);
    });

    it('should reject user registration', async () => {
      const saveUser = jest.spyOn(userRepository, 'save').mockRejectedValueOnce(new Error('error'));
      await expect(userService.saveUserRegistration(userRegistration)).rejects.toEqual(
        UserErrorNames.USER_REGISTERED,
      );
      expect(saveUser).toBeCalledTimes(1);
      expect(saveUser).toBeCalledWith(userRegistration);
    });
  });

  describe('Update user', () => {
    it('should update user with new values', async () => {
      await expect(userService.update(userId, updateUserValue)).resolves.toBeTruthy();
      expect(userRepository.update).toBeCalledTimes(1);
      expect(userRepository.update).toBeCalledWith(userId, updateUserValue);
    });

    it('should reject user updates', async () => {
      const updateUser = jest
        .spyOn(userRepository, 'update')
        .mockRejectedValueOnce(new Error('error'));
      await expect(userService.update(userId, updateUserValue)).rejects.toEqual(
        UserErrorNames.USER_UPDATE,
      );
      expect(updateUser).toHaveBeenCalledTimes(1);
      expect(updateUser).toHaveBeenCalledWith(userId, updateUserValue);
    });
  });

  describe('Find user data with password', () => {
    it('returns user data with password', async () => {
      await expect(userService.findPasswordByEmail(userEmail, clientId)).resolves.toEqual(
        userWithPassword,
      );
      expect(userRepository.findDelicateUserData).toHaveBeenCalledTimes(1);
      expect(userRepository.findDelicateUserData).toHaveBeenCalledWith(userEmail, clientId);
    });

    it('throw error if email does not exists', async () => {
      const findDelicateUserData = jest
        .spyOn(userRepository, 'findDelicateUserData')
        .mockRejectedValueOnce(new Error('error'));
      await expect(userService.findPasswordByEmail(userEmail, clientId)).rejects.toEqual(
        UserErrorNames.USER_EMAIL_NOT_EXISTS,
      );
      expect(findDelicateUserData).toHaveBeenCalledTimes(1);
      expect(findDelicateUserData).toHaveBeenCalledWith(userEmail, clientId);
    });
  });

  describe('Find user with email', () => {
    it('Find user data without password', async () => {
      await expect(
        userService.findByEmail(userEmail, clientId).then((data) => {
          return Object.keys(data);
        }),
      ).resolves.not.toContain('password');
      expect(userRepository.findUserData).toHaveBeenCalledTimes(1);
      expect(userRepository.findUserData).toHaveBeenCalledWith(userEmail, clientId);
    });

    it('Throw error when if email does not exists', async () => {
      const findUserData = jest
        .spyOn(userRepository, 'findUserData')
        .mockRejectedValueOnce(new Error('error'));
      await expect(userService.findByEmail(userEmail, clientId)).rejects.toEqual(
        UserErrorNames.USER_EMAIL_NOT_EXISTS,
      );
      expect(findUserData).toHaveBeenCalledTimes(1);
      expect(findUserData).toHaveBeenCalledWith(userEmail, clientId);
    });
  });

  describe('Find user by restore password token', () => {
    it('Find user data successfully', async () => {
      await expect(userService.findByRestoreToken(restorePasswordToken, clientId)).resolves.toEqual(
        userDataRestoreToken,
      );
      expect(userRepository.findByRestorePasswordToken).toHaveBeenCalledTimes(1);
      expect(userRepository.findByRestorePasswordToken).toHaveBeenCalledWith(
        restorePasswordToken,
        clientId,
      );
    });

    it('Throw error when if email does not exists', async () => {
      const findByRestorePasswordToken = jest
        .spyOn(userRepository, 'findByRestorePasswordToken')
        .mockRejectedValueOnce(new Error('error'));
      await expect(userService.findByRestoreToken(restorePasswordToken, clientId)).rejects.toEqual(
        UserErrorNames.USER_NOT_EXISTS,
      );
      expect(findByRestorePasswordToken).toHaveBeenCalledTimes(1);
      expect(findByRestorePasswordToken).toHaveBeenCalledWith(restorePasswordToken, clientId);
    });
  });

  describe('Update user password', () => {
    it('Updates password', async () => {
      await expect(userService.updatePassword(userUpdatePassword as User)).resolves.toEqual(
        returnedUserValue,
      );
      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith({
        ...userUpdatePassword,
        isValidPasswordToken: false,
      });
    });

    it("Throw error if can't update user password", async () => {
      const save = jest.spyOn(userRepository, 'save').mockRejectedValueOnce(new Error('error'));
      await expect(userService.updatePassword(userUpdatePassword as User)).rejects.toEqual(
        UserErrorNames.USER_UPDATE_PASSWORD,
      );
      expect(save).toHaveBeenCalledTimes(1);
      expect(save).toHaveBeenCalledWith({
        ...userUpdatePassword,
        isValidPasswordToken: false,
      });
    });
  });

  describe('Saves restore password token', () => {
    it('Saves restore password token successfully', async () => {
      await expect(
        userService.saveRestorePasswordToken(userUpdatePassword as User, restorePasswordToken),
      ).resolves.toEqual(returnedUserValue);
      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith({
        id: userId,
        restorePasswordToken: restorePasswordToken,
        restorePasswordDate: new Date(),
        isValidPasswordToken: true,
      });
    });

    it("Throw error if can't save restore password token", async () => {
      const save = jest.spyOn(userRepository, 'save').mockRejectedValueOnce(new Error('error'));
      const savei = jest.spyOn(userRepository, 'save');
      await expect(
        userService.saveRestorePasswordToken(userUpdatePassword as User, restorePasswordToken),
      ).rejects.toEqual(UserErrorNames.USER_UPDATE_RESTORE_TOKEN);
      expect(save).toHaveBeenCalledTimes(1);
      expect(save).toHaveBeenCalledWith({
        id: userId,
        restorePasswordToken: restorePasswordToken,
        restorePasswordDate: new Date(),
        isValidPasswordToken: true,
      });
    });
  });
});
