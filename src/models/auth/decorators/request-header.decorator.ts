import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate, validateOrReject } from 'class-validator';

export const validateHeaders = async (value: any, ctx: ExecutionContext) => {
  // extract headers
  const headers = ctx.switchToHttp().getRequest().headers;

  // Convert headers to DTO object
  const dto = plainToClass(value, headers, { excludeExtraneousValues: true });

  // Validate
  const errors = await validate(dto, { whitelist: true });

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
  // return header dto object
  return dto;
};

export const RequestHeader = createParamDecorator(validateHeaders);
