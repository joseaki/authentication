import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  IUserCompleteRegistration,
  IUserEmail,
  IUserPasswordUpdate,
  IUserRegistration,
} from 'src/interfaces/IUser';
import { UsersService } from 'src/users/users.service';
import { exists } from 'fs';
import { IHeader } from 'src/interfaces/IHeaders';
import { MailService } from 'src/mailer/mailer.service';
import { UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  validateUser(email: string, pass: string, clientId: number): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.userService.findPasswordByEmail(
          email,
          clientId,
        );
        console.log(user);
        if (user) {
          bcrypt.compare(pass, user.password, function (err, result) {
            console.log(err);
            console.log(result);
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
      } catch (error) {
        reject(error);
      }
    });
  }

  async register(user: IUserRegistration, clientId) {
    const encriptedPassword = await this.encriptPassword(user.password);
    const userToBeSaved: IUserCompleteRegistration = {
      email: user.email,
      password: encriptedPassword,
      clientId: clientId,
    };
    return this.userService.saveUserRegistration(userToBeSaved);
  }

  async login(user: any) {
    const payload = {
      username: user.email,
      sub: user.id,
      isComplete: user.isComplete,
    };
    const refreshToken = this.getRandomToken(128);
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: refreshToken,
    };
  }

  async restorePassword(user: IUserEmail, clientId: number) {
    const userData = await this.userService.emailExists(user.email, clientId);
    const restorePasswordToken = this.getRandomToken(64);
    this.userService.saveRestorePasswordToken(userData, restorePasswordToken);
    return this.mailService.sendRestorePasswordEmail(
      userData,
      `https://recovey.com/?client=${clientId}&code=${restorePasswordToken}`,
    );
  }

  async updatePassword(user: IUserPasswordUpdate, clientId: number) {
    const userData = await this.validateUserUpdateToken(user.token, clientId);
    const encriptedPassword = await this.encriptPassword(user.password);
    userData.password = encriptedPassword;
    return this.userService.updatePassword(userData);
  }

  private async encriptPassword(password: string) {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
  }

  private getRandomToken(characters: number) {
    return crypto
      .randomBytes(characters)
      .toString('base64')
      .slice(0, characters)
      .replace(/\W/g, '');
  }

  private async validateUserUpdateToken(token, clientId): Promise<User> {
    const userData = await this.userService.findByRestoreToken(token, clientId);
    const currentDate = new Date().getTime();
    const tokenValidUntil =
      new Date(userData.restorePasswordDate).getTime() + 30 * 60 * 1000;
    if (currentDate > tokenValidUntil) {
      throw new UnauthorizedException('Expired token');
    }
    return userData;
  }
}
