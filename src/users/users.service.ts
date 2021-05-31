import { Injectable, NotAcceptableException } from '@nestjs/common';
import { UpdateUserDto } from './dto/in/update-user.dto';
import { User } from './entities/user.entity';
import { IUserCompleteRegistration } from 'src/interfaces/IUser';
import { UserRepository } from './repository/user.repository';
import ErrorNames from './errors';
@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}

  async saveUserRegistration(userRegistrationData: IUserCompleteRegistration) {
    try {
      const savedResponse = await this.userRepository.save(
        userRegistrationData,
      );
      return savedResponse;
    } catch (error) {
      throw ErrorNames.USER_REGISTERED;
    }
  }

  async update(id: number, updateUserDto: Partial<User>) {
    try {
      return await this.userRepository.update(id, updateUserDto);
    } catch (error) {
      throw ErrorNames.USER_UPDATE;
    }
  }

  async findPasswordByEmail(email: string, clientId: number) {
    try {
      const user = await this.userRepository.findDelicateUserData(
        email,
        clientId,
      );
      if (!user) new Error();
      return user;
    } catch (error) {
      throw ErrorNames.USER_EMAIL_NOT_EXISTS;
    }
  }

  async findByEmail(email: string, clientId: number) {
    try {
      const user = await this.userRepository.findUserData(email, clientId);
      if (!user) throw Error();
      return user;
    } catch (error) {
      throw ErrorNames.USER_EMAIL_NOT_EXISTS;
    }
  }

  async findByRestoreToken(token: string, clientId: number) {
    try {
      const user = await this.userRepository.findByRestorePasswordToken(
        token,
        clientId,
      );
      if (!user) throw Error();
      return user;
    } catch (error) {
      throw ErrorNames.USER_NOT_EXISTS;
    }
  }

  async updatePassword(user: User) {
    try {
      return await this.userRepository.save({
        id: user.id,
        password: user.password,
        isValidPasswordToken: false,
      });
    } catch (error) {
      throw ErrorNames.USER_UPDATE_PASSWORD;
    }
  }

  async saveRestorePasswordToken(user: User, token) {
    try {
      return await this.userRepository.save({
        id: user.id,
        restorePasswordToken: token,
        restorePasswordDate: new Date(),
        isValidPasswordToken: true,
      });
    } catch (error) {
      throw ErrorNames.USER_UPDATE_RESTORE_TOKEN;
    }
  }
}
