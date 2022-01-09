import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsUtc0(property?: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsUtc0',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: {
        message: 'Current date should be in UTC-0 format',
        ...validationOptions,
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          return !new RegExp(/((\+|-)[0-9]{4})|((\+|-)[0-9]{2}:[0-9]{2})/g).test(value);
        },
      },
    });
  };
}
