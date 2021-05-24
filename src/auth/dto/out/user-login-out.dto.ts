import { Expose } from 'class-transformer';

export class UserLoginOutDto {
  /**
   * access token
   * @example asdfdddddddddddddddasasdf.sadfddddddddddddddddddd.sdfaddddddddddssssssssssss
   */
  @Expose() access_token: number;

  /**
   * refresh token
   * @example jsssssssdasdfasdfaslaisdjkclkjanleionaknlinanvaoio
   */
  @Expose() refresh_token: string;
}
