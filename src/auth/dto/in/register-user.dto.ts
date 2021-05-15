import { IsEmail, IsString } from 'class-validator';
import { IClientId, IUserRegistration } from 'src/interfaces/IUser';

export class RegisterUserDto implements IUserRegistration {
  /**
   * user email
   * @example johndoe@example.com
   */
  @IsEmail()
  email: string;

  /**
   * user password
   * @example #SuperSecure123
   */
  @IsString()
  password: string;
}
