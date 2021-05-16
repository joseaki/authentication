import { IsEmail } from 'class-validator';
import { IUserEmail } from 'src/interfaces/IUser';

export class UserPasswordRecovery implements IUserEmail {
  /**
   * User email to recovery
   * @example johndoe@example.com
   */
  @IsEmail()
  email: string;
}
