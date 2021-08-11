import { Injectable, NotAcceptableException } from '@nestjs/common';
import { UpdateUserDto } from './dto/in/update-user.dto';
import { User } from './entities/user.entity';
import { IUserCompleteRegistration } from 'src/interfaces/IUser';
import { UserRepository } from './repository/user.repository';
import { ErrorService } from '../error/error.service';
import UserErrorNames from './errors';
@Injectable()
export class UsersService {
  constructor(
    private userRepository: UserRepository,
    private errorService: ErrorService,
  ) {}

  async saveUserRegistration(userRegistrationData: IUserCompleteRegistration) {
    try {
      const savedResponse = await this.userRepository.save(
        userRegistrationData,
      );
      return savedResponse;
    } catch (error) {
      throw new Error(this.errorService.getErrorMessage(error));
    }
  }

  async update(id: number, updateUserDto: Partial<User>) {
    try {
      return await this.userRepository.update(id, updateUserDto);
    } catch (error) {
      throw new Error(this.errorService.getErrorMessage(error));
    }
  }

  async findPasswordByEmail(email: string, clientId: number) {
    try {
      const user = await this.userRepository.findDelicateUserData(
        email,
        clientId,
      );
      return user;
    } catch (error) {
      throw new Error(this.errorService.getErrorMessage(error));
    }
  }

  async findByEmail(email: string, clientId: number) {
    try {
      const user = await this.userRepository.findUserData(email, clientId);
      return user;
    } catch (error) {
      throw new Error(this.errorService.getErrorMessage(error));
    }
  }

  async findByRestoreToken(token: string, clientId: number) {
    try {
      const user = await this.userRepository.findByRestorePasswordToken(
        token,
        clientId,
      );
      return user;
    } catch (error) {
      throw new Error(this.errorService.getErrorMessage(error, 'token_error'));
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
      throw new Error(this.errorService.getErrorMessage(error));
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
      throw new Error(this.errorService.getErrorMessage(error));
    }
  }
}
