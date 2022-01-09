import { Expose } from 'class-transformer';
import { ICreateDateParam, IIdParam } from 'interfaces/IUniversal';
import { IUserComplete, IUserEmail } from 'interfaces/IUser';

export class CreateUserOutDto implements IUserEmail, ICreateDateParam, IIdParam, IUserComplete {
  /**
   * user Id
   * @example 123
   */
  @Expose() id: number;

  /**
   * user email
   * @example johndoe@example.com
   */
  @Expose() email: string;

  /**
   * true if user has completed their information
   * @example false
   */
  @Expose() isComplete: boolean;

  /**
   * Creation Date
   */
  @Expose() createdAt: Date;
}
