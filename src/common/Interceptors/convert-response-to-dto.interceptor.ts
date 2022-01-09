import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { map } from 'rxjs/operators';

@Injectable()
export class ConvertResponseToDtoInterceptor implements NestInterceptor {
  constructor(private DTOClass: any) {}
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data) => {
        return plainToClass(this.DTOClass, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
