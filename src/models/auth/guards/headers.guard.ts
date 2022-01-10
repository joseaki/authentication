import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ERROR } from 'common/constants/errors';
import { IValidationError } from 'common/interfaces/IValidationError';
import { Observable } from 'rxjs';
import { HeaderDTO } from '../dto/in/header.dto';

@Injectable()
export class HeadersAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return new Promise(async (resolve, reject) => {
      const headers = context.switchToHttp().getRequest().headers;
      // Convert headers to DTO object
      const headersDTO = plainToClass(HeaderDTO, headers, {
        excludeExtraneousValues: true,
      });
      // Validate
      const errors = await validate(headersDTO, { whitelist: true });
      if (errors.length > 0) {
        reject(
          new UnprocessableEntityException(
            errors.map<IValidationError>((error) => ({
              constraints: Object.values(error.constraints),
              codes: Object.keys(error.constraints),
              value: error.value,
              property: error.property,
              children: error.children,
            })),
            ERROR.VALIDATION_ERROR,
          ),
        );
      } else {
        resolve(true);
      }
    });
  }
}
