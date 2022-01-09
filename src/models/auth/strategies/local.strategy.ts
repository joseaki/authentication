import { Injectable, BadRequestException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { IUserCompleteRegistration } from 'interfaces/IUser';

@Injectable()
export class LocalStrategy {
  constructor(private authService: AuthService) {}

  async validate(payload: IUserCompleteRegistration): Promise<any> {
    const { email, password, clientId } = payload;
    try {
      return await this.authService.validateUser(email, password, clientId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
