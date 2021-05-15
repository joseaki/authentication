import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Observable } from 'rxjs';
import {
  RequestHeader,
  validateHeaders,
} from '../decorators/request-header.decorator';
import { HeaderDTO } from '../dto/in/header.dto';

@Injectable()
export class HeadersAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
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
          new UnauthorizedException(
            errors.map((error) => ({
              constraints: error.constraints,
              value: error.value,
              property: error.property,
              children: error.children,
            })),
            'Validation Error',
          ),
        );
      } else {
        resolve(true);
      }
    });
  }
}
