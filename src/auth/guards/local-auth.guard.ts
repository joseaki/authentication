import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Observable } from 'rxjs';
import { IUserCompleteRegistration } from 'src/interfaces/IUser';
import { HeaderDTO } from '../dto/in/header.dto';
import { LoginUserDto } from '../dto/in/login-user.dto';
import { LocalStrategy } from '../strategies/local.strategy';

@Injectable()
export class LocalAuthGuard implements CanActivate {
  constructor(private localStrategy: LocalStrategy) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return new Promise(async (resolve, reject) => {
      const req = context.switchToHttp().getRequest();
      const { headers, body } = req;
      // Convert headers to DTO object
      const headersDTO = plainToClass(HeaderDTO, headers, {
        excludeExtraneousValues: true,
      });

      const loginUserDTO = plainToClass(LoginUserDto, body, {
        excludeExtraneousValues: true,
      });

      const errors = await validate(loginUserDTO, { whitelist: true });

      if (errors.length > 0) {
        reject(
          new BadRequestException(
            errors.map((error) => ({
              constraints: error.constraints,
              value: error.value,
              property: error.property,
              children: error.children,
            })),
            'Validation Error',
          ),
        );
      }

      const userData: IUserCompleteRegistration = {
        email: loginUserDTO.username,
        password: loginUserDTO.password,
        clientId: +headersDTO['client-id'],
      };
      try {
        const user = await this.localStrategy.validate(userData);
        req.user = user;
        resolve(true);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }
}
