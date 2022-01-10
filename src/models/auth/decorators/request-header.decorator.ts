import {
  createParamDecorator,
  ExecutionContext,
  UnprocessableEntityException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ERROR } from 'common/constants/errors';
import { IValidationError } from 'common/interfaces/IValidationError';

export const validateHeaders = async (value: any, ctx: ExecutionContext) => {
  // extract headers
  const headers = ctx.switchToHttp().getRequest().headers;

  // Convert headers to DTO object
  const dto = plainToClass(value, headers, { excludeExtraneousValues: true });

  // Validate
  const errors = await validate(dto, { whitelist: true });

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
  // return header dto object
  return dto;
};

export const RequestHeader = createParamDecorator(validateHeaders);
