import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Reflector } from '@nestjs/core';
import { IUserCompleteRegistration } from 'src/interfaces/IUser';

@Injectable()
export class LocalStrategy {
  constructor(private authService: AuthService) {}

  async validate(payload: IUserCompleteRegistration): Promise<any> {
    const { email, password, clientId } = payload;
    try {
      return await this.authService.validateUser(email, password, clientId);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
