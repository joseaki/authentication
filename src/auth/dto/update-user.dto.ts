import { PartialType } from '@nestjs/mapped-types';
import { RegisterUserDto } from './in/register-user.dto';

export class UpdateUserDto extends PartialType(RegisterUserDto) {}
