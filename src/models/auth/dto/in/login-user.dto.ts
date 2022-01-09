import { Expose } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

export class LoginUserDto {
  /**
   * user email
   * @example johndoe@example.com
   */
  @IsEmail()
  @Expose()
  username: string;

  /**
   * user password
   * @example #SuperSecure123
   */
  @IsString()
  @Expose()
  password: string;
}
