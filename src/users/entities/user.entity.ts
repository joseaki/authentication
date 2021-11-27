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
  @Column({ type: 'tinyint', default: false })
  isComplete: boolean;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: false })
  clientId: number;
  // }

  // @ChildEntity()
  // export class CompleteUserInfo
  //   extends User
  //   implements ICompleteUserRegistration, IUserMetadata, IRestorePassword {
  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  lastname: string;

  @Column({ nullable: true })
  displayname: string;

  @Column({ nullable: true })
  birthday: Date;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  district: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  postCode: string;

  @Column({ nullable: true })
  telephone: string;

  @Column({ nullable: true })
  lastLogin: Date;

  @Column({ nullable: true })
  lastLoginIP: string;

  @Column({ nullable: true })
  registeredIP: string;

  @Column({ nullable: true })
  restorePasswordToken: string;

  @Column({ nullable: true })
  restorePasswordDate: Date;

  @Column({ default: false })
  isValidPasswordToken: boolean;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ nullable: true })
  refreshTokenEmitDate: Date;
}
