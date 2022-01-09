import { Injectable } from '@nestjs/common';

// Entities
import { User } from './entities/user.entity';
// Interfaces
import { IUserCompleteRegistration } from 'interfaces/IUser';
// Repositories
import { UserRepository } from './repository/user.repository';
// Services
import { ErrorService } from '../../error/error.service';

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository, private errorService: ErrorService) {}

  async saveUserRegistration(userRegistrationData: IUserCompleteRegistration) {
    try {
      const savedResponse = await this.userRepository.save(userRegistrationData);
      return savedResponse;
    } catch (error) {
      const errorMessage = this.errorService.getErrorMessage(error);
      throw this.errorService.getException(errorMessage);
    }
  }

  async update(id: number, updateUserDto: Partial<User>) {
    try {
      return await this.userRepository.update(id, updateUserDto);
    } catch (error) {
      const errorMessage = this.errorService.getErrorMessage(error);
      throw this.errorService.getException(errorMessage);
    }
  }

  async findPasswordByEmail(email: string, clientId: number) {
    try {
      const user = await this.userRepository.findDelicateUserData(email, clientId);
      return user;
    } catch (error) {
      console.log('error', error);
      const errorMessage = this.errorService.getErrorMessage(error);
      throw this.errorService.getException(errorMessage);
    }
  }

  async findByEmail(email: string, clientId: number) {
    try {
      const user = await this.userRepository.findUserData(email, clientId);
      return user;
    } catch (error) {
      const errorMessage = this.errorService.getErrorMessage(error);
      throw this.errorService.getException(errorMessage);
    }
  }

  async findByRestoreToken(token: string, clientId: number) {
    try {
      const user = await this.userRepository.findByRestorePasswordToken(token, clientId);
      return user;
    } catch (error) {
      const errorMessage = this.errorService.getErrorMessage(error);
      throw this.errorService.getException(errorMessage);
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
      const errorMessage = this.errorService.getErrorMessage(error);
      throw this.errorService.getException(errorMessage);
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
      const errorMessage = this.errorService.getErrorMessage(error);
      throw this.errorService.getException(errorMessage);
    }
  }
}
