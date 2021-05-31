import { BaseEntity } from '../../common/entities/base.entity';
import {
  IClientId,
  ICompleteUserRegistration,
  IRefreshToken,
  IRestorePassword,
  IUserComplete,
  IUserMetadata,
  IUserRegistration,
} from 'src/interfaces/IUser';
import { Column, Entity, Unique } from 'typeorm';

@Entity()
@Unique('UNQ_USER', ['email', 'clientId'])
// @TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class User
  extends BaseEntity
  implements
    IUserRegistration,
    IUserComplete,
    IClientId,
    ICompleteUserRegistration,
    IUserMetadata,
    IRestorePassword,
    IRefreshToken {
  @Column({ type: 'boolean', default: false })
  isComplete: boolean;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: false })
  clientId: number;
  // }

  // @ChildEntity()
  // export class CompleteUserInfo
  //   extends User
  //   implements ICompleteUserRegistration, IUserMetadata, IRestorePassword {
  @Column()
  username: string;

  @Column()
  name: string;

  @Column()
  lastname: string;

  @Column()
  displayname: string;

  @Column()
  birthday: Date;

  @Column()
  gender: string;

  @Column()
  district: string;

  @Column()
  address: string;

  @Column()
  postCode: string;

  @Column()
  telephone: string;

  @Column()
  lastLogin: Date;

  @Column()
  lastLoginIP: string;

  @Column()
  registeredIP: string;

  @Column()
  restorePasswordToken: string;

  @Column()
  restorePasswordDate: Date;

  @Column({ default: false })
  isValidPasswordToken: boolean;

  @Column()
  refreshToken: string;

  @Column()
  refreshTokenEmitDate: Date;
}
