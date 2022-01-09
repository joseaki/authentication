import { Expose } from 'class-transformer';

export class UserUpdatePasswordDto {
  /**
   * Password updated successfully
   * @example true
   */
  @Expose() updated: boolean;
}
