import { IsDate, IsNumber, IsPostalCode, IsString } from 'class-validator';
import { ICompleteUserRegistration } from 'src/interfaces/IUser';
import { PartialType } from '@nestjs/mapped-types';

class UpdateUserDto2 implements ICompleteUserRegistration {
  /**
   * user's first name
   * @example john
   */
  @IsString()
  name: string;

  /**
   * user's last name
   * @example Doe
   */
  @IsString()
  lastname: string;

  /**
   * user's username or nickname
   * @example johnDo
   */
  @IsString()
  username?: string;

  /**
   * user's short name
   * @example John Doe
   */
  @IsString()
  displayname?: string;

  /**
   * birthday date MM/DD/YYYY
   * @example 08/25/1990
   */
  @IsDate()
  birthday?: Date;

  /**
   * gender
   * @example male
   */
  @IsString()
  gender?: string;

  /**
   * district
   */
  @IsString()
  district?: string;

  /**
   * address
   */
  @IsString()
  address?: string;

  /**
   * Postal code
   */
  @IsPostalCode()
  postCode?: string;

  /**
   * phone number
   */
  @IsString()
  telephone?: string;

  /**
   * ID of client (Application ID)
   * @example 1
   */
  @IsNumber()
  clientId: number;
}

export class UpdateUserDto extends PartialType(UpdateUserDto2) {}
