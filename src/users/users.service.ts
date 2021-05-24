import {
  Injectable,
  NotAcceptableException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/in/update-user.dto';
import { User } from './entities/user.entity';
import { IUserCompleteRegistration } from 'src/interfaces/IUser';
import { SqlException } from 'src/exceptions/sql.exception';
import { UserRepository } from './repository/user.repository';

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
      throw new NotAcceptableException('User already registered');
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      return await this.userRepository.update(id, updateUserDto);
    } catch (error) {
      throw new NotAcceptableException("Can't update user");
    }
  }

  async findPasswordByEmail(email: string, clientId: number) {
    try {
      const user = await this.userRepository.findDelicateUserData(
        email,
        clientId,
      );
      if (!user) throw new NotAcceptableException("Can't get a user");
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email: string, clientId: number) {
    try {
      const user = await this.userRepository.findUserData(email, clientId);
      if (!user) throw new NotAcceptableException('User not found');
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findByRestoreToken(token: string, clientId: number) {
    try {
      const user = await this.userRepository.findByRestorePasswordToken(
        token,
        clientId,
      );
      if (!user) throw new NotAcceptableException("Can't get a user");
      return user;
    } catch (error) {
      throw error;
    }
  }

  updatePassword(user: User) {
    return this.userRepository.save({
      id: user.id,
      password: user.password,
      isValidPasswordToken: false,
    });
  }

  saveRestorePasswordToken(user: User, token) {
    this.userRepository.save({
      id: user.id,
      restorePasswordToken: token,
      restorePasswordDate: new Date(),
      isValidPasswordToken: true,
    });
  }
}
