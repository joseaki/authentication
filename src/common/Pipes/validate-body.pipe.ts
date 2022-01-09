import {
  ArgumentMetadata,
  UnprocessableEntityException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ClassTransformOptions, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ERROR } from 'common/constants/errors';
import { IValidationError } from 'interfaces/IValidationError';

@Injectable()
export class ValidateBodyPipe implements PipeTransform {
  constructor(private classTransformOptions?: ClassTransformOptions) {}

  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || this.isScalarType(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value, {
      excludeExtraneousValues: true,
      ...this.classTransformOptions,
    });

    const errors = await validate(object, { whitelist: true });

    if (errors.length > 0) {
      throw new UnprocessableEntityException(
        errors.map<IValidationError>((error) => ({
          constraints: Object.values(error.constraints),
          codes: Object.keys(error.constraints),
          value: error.value,
          property: error.property,
          children: error.children,
        })),
        ERROR.VALIDATION_ERROR,
      );
    }

    return object;
  }

  private isScalarType(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return types.includes(metatype);
  }
}
