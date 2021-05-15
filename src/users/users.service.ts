import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/in/register-user.dto';
import { UpdateUserDto } from './dto/in/update-user.dto';
import { CompleteUserInfo, User } from './entities/user.entity';
import { SALT_MIN, SALT_MAX } from 'src/common/constants';
import {
  IUserCompleteRegistration,
  IUserRegistration,
} from 'src/interfaces/IUser';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(User)
    private completeuserRepository: Repository<CompleteUserInfo>,
  ) {}

  saveUserRegistration(userRegistrationData: IUserCompleteRegistration) {
    return this.userRepository.save(userRegistrationData);
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.completeuserRepository.update(id, updateUserDto);
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  findByEmail(email: string, clientId: number) {
    return this.userRepository.findOne({
      where: { email: email, clientId: clientId },
    });
  }
}
