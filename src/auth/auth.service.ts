import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUserPasswordUpdate, IUserRegistration } from 'src/interfaces/IUser';
import { IUserCompleteRegistration, IUserEmail } from 'src/interfaces/IUser';
import { UsersService } from 'src/users/users.service';
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
        bcrypt.compare(pass, user.password, (err, result) => {
          if (result === true) {
            const { password, ...rest } = user;
            resolve(rest);
          } else {
            reject(new BadRequestException('Incorrect password'));
          }
        });
      } catch (error) {
        reject(new BadRequestException('Incorrect user or password'));
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

  async login(user: User) {
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
  }

  async restorePassword(user: IUserEmail, clientId: number) {
    try {
      const userData = await this.userService.findByEmail(user.email, clientId);
      if (userData) {
        const restorePasswordToken = this.getRandomToken(64);
        this.userService.saveRestorePasswordToken(
          userData,
          restorePasswordToken,
        );
        return this.mailService.sendRestorePasswordEmail(
          userData,
          `https://recovey.com/?client=${clientId}&code=${restorePasswordToken}`,
        );
      } else {
        throw new BadRequestException('User not found');
      }
    } catch (error) {
      throw error;
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
      throw new BadRequestException(
        'Password already changed or link is expired',
      );
    }
  }

  // ==================================================
  // =============== PRIVATE METHODS ==================
  // ==================================================

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
    try {
      const userData = await this.userService.findByRestoreToken(
        token,
        clientId,
      );
      const currentDate = new Date().getTime();
      const tokenValidUntil =
        new Date(userData.restorePasswordDate).getTime() + 30 * 60 * 1000;
      if (currentDate > tokenValidUntil) {
        throw new UnauthorizedException('Expired token');
      }
      return userData;
    } catch (error) {
      throw error;
    }
  }
}
