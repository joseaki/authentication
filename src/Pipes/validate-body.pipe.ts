import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidateBodyPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || this.isScalarType(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value, {
      excludeExtraneousValues: true,
    });

    const errors = await validate(object, { whitelist: true });

    if (errors.length > 0) {
      throw new BadRequestException(
        errors.map((error) => ({
          constraints: error.constraints,
          value: error.value,
          property: error.property,
          children: error.children,
        })),
        'Validation Error',
      );
    }
    return object;
  }

  private isScalarType(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return types.includes(metatype);
  }
}
