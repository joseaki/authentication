import { Injectable, UnprocessableEntityException } from '@nestjs/common';
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
      throw new SqlException(error);
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      return await this.userRepository.update(id, updateUserDto);
    } catch (error) {
      throw new SqlException(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findPasswordByEmail(email: string, clientId: number) {
    try {
      return await this.userRepository.findDelicateUserData(email, clientId);
    } catch (error) {
      throw new SqlException(error);
    }
  }

  async findByEmail(email: string, clientId: number) {
    try {
      return await this.userRepository.findUserData(email, clientId);
    } catch (error) {
      throw new SqlException(error);
    }
  }

  async findByRestoreToken(token: string, clientId: number) {
    try {
      return await this.userRepository.findByRestorePasswordToken(
        token,
        clientId,
      );
    } catch (error) {
      throw new SqlException(error);
    }
  }

  updatePassword(user: User) {
    return this.userRepository.save({
      id: user.id,
      password: user.password,
      isValidPasswordToken: false,
    });
  }

  async emailExists(email: string, clientId: number) {
    try {
      return await this.findByEmail(email, clientId);
    } catch (error) {
      throw new SqlException(error);
    }
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
