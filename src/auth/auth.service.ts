import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUserPasswordUpdate, IUserRegistration } from 'src/interfaces/IUser';
import { IUserCompleteRegistration, IUserEmail } from 'src/interfaces/IUser';
import { UsersService } from 'src/users/users.service';
import { MailService } from 'src/mailer/mailer.service';
import { User } from 'src/users/entities/user.entity';
import AuthErrorNames from './errors';

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
        bcrypt.compare(pass, user.password, (err, result) => {
          if (result === true) {
            const { password, ...rest } = user;
            resolve(rest);
          } else {
            reject(new Error(AuthErrorNames.INCORRECT_PASSWORD));
          }
        });
      } catch (error) {
        reject(new Error(error.message));
      }
    });
  }

  async register(user: IUserRegistration, clientId: number) {
    try {
      const encriptedPassword = await this.encriptPassword(user.password);
      const userToBeSaved: IUserCompleteRegistration = {
        email: user.email,
        password: encriptedPassword,
        clientId: clientId,
      };
      return await this.userService.saveUserRegistration(userToBeSaved);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async login(user: User) {
    try {
      const payload = {
        username: user.email,
        sub: user.id,
        isComplete: user.isComplete,
      };
      const refreshToken = this.getRandomToken(128);
      this.userService.update(user.id, {
        refreshToken,
        refreshTokenEmitDate: new Date(),
      });
      return {
        access_token: this.jwtService.sign(payload),
        refresh_token: refreshToken,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async restorePassword(user: IUserEmail, clientId: number) {
    try {
      const userData = await this.userService.findByEmail(user.email, clientId);
      const restorePasswordToken = this.getRandomToken(64);
      this.userService.saveRestorePasswordToken(userData, restorePasswordToken);
      return this.mailService.sendRestorePasswordEmail(
        userData,
        `https://recovey.com/?client=${clientId}&code=${restorePasswordToken}`,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updatePassword(user: IUserPasswordUpdate, clientId: number) {
    try {
      const userData = await this.validateUserUpdateToken(user.token, clientId);
      const encriptedPassword = await this.encriptPassword(user.password);
      userData.password = encriptedPassword;
      await this.userService.updatePassword(userData);
      this.mailService.sendPasswordRestoredEmail(userData);
      return { updated: true };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  private async encriptPassword(password: string) {
    try {
      const salt = await bcrypt.genSalt(12);
      return bcrypt.hash(password, salt);
    } catch (error) {
      throw new Error(AuthErrorNames.ENCRYPTION_ERROR);
    }
  }

  private getRandomToken(characters: number) {
    try {
      return crypto
        .randomBytes(characters)
        .toString('base64')
        .slice(0, characters)
        .replace(/\W/g, '');
    } catch (error) {
      throw new Error(AuthErrorNames.RANDOM_TOKEN);
    }
  }

  private async validateUserUpdateToken(token, clientId): Promise<User> {
    try {
      const userData = await this.userService.findByRestoreToken(
        token,
        clientId,
      );
      const currentDate = new Date().getTime();
      const tokenValidUntil =
        new Date(userData.restorePasswordDate).getTime() + 30 * 60 * 1000;
      if (currentDate > tokenValidUntil) {
        throw new Error(AuthErrorNames.EXPIRED_TOKEN);
      }
      return userData;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
