import { IsEmail, IsString } from 'class-validator';
import { IUserEmail, IUserPasswordUpdate } from 'src/interfaces/IUser';

export class UserPasswordRecovery implements IUserEmail {
  /**
   * User email to recovery
   * @example johndoe@example.com
   */
  @IsEmail()
  email: string;
}

export class UserPasswordUpdate implements IUserPasswordUpdate {
  /**
   * token send to user via email in the recovery link
   * @example fdASDKLFASDKFASfaSKLFAOEkansfE
   */
  @IsString()
  token: string;

  /**
   * User new password
   * @example newPassword
   */
  @IsString()
  password: string;
}
