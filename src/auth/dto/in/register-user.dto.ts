import { Expose } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';
import { IUserRegistration } from 'src/interfaces/IUser';

export class RegisterUserDto implements IUserRegistration {
  /**
   * user email
   * @example johndoe@example.com
   */
  @IsEmail()
  @Expose()
  email: string;

  /**
   * user password
   * @example #SuperSecure123
   */
  @IsString()
  @Expose()
  password: string;
}
