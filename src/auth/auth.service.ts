import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  IUserCompleteRegistration,
  IUserRegistration,
} from 'src/interfaces/IUser';
import { UsersService } from 'src/users/users.service';
import { exists } from 'fs';
import { IHeader } from 'src/interfaces/IHeaders';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  validateUser(email: string, pass: string, clientId: number): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const user = await this.userService.findByEmail(email, clientId);
      if (user) {
        bcrypt.compare(pass, user.password, function (err, result) {
          if (result === true) {
            const { password, ...rest } = user;
            resolve(rest);
          } else {
            reject('incorrect password');
          }
        });
      } else {
        reject('user does not exists');
      }
    });
  }

  async register(user: IUserRegistration, headers: IHeader) {
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(user.password, salt);
    const userToBeSaved: IUserCompleteRegistration = {
      email: user.email,
      password: hash,
      clientId: +headers['client-id'],
    };
    return this.userService.saveUserRegistration(userToBeSaved);
  }

  async login(user: any) {
    const payload = {
      username: user.email,
      sub: user.id,
      isComplete: user.isComplete,
    };
    const randomToken = crypto
      .randomBytes(128)
      .toString('base64')
      .slice(0, 128)
      .replace(/\W/g, '');
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: randomToken,
    };
  }
}
