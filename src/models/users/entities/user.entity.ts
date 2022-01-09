import { Column, Entity, Unique } from 'typeorm';
// Interfaces
import { IClientId, ICompleteUserRegistration, IRefreshToken, IRestorePassword, IUserComplete, IUserMetadata, IUserRegistration } from 'interfaces/IUser';
import { GenderTypes } from 'common/interfaces/enum';
// Entities
import { BaseEntity } from 'common/entities/base.entity';

@Entity()
@Unique('UNQ_USER', ['email', 'clientId'])
export class User
  extends BaseEntity
  implements IUserRegistration, IUserComplete, IClientId, ICompleteUserRegistration, IUserMetadata, IRestorePassword, IRefreshToken
{
  @Column({ name: 'is_complete', type: 'boolean', default: false })
  isComplete: boolean;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'password' })
  password: string;

  @Column({ nullable: false })
  clientId: number;

  @Column({ name: 'username', nullable: true })
  username: string;

  @Column({ name: 'name', nullable: true })
  name: string;

  @Column({ name: 'lastname', nullable: true })
  lastname: string;

  @Column({ name: 'displayname', nullable: true })
  displayname: string;

  @Column({ name: 'birthday', type: 'date', nullable: true })
  birthday: Date;

  @Column({ name: 'gender', nullable: true, enum: GenderTypes, enumName: 'GenderTypes', type: 'enum' })
  gender: GenderTypes;

  @Column({ name: 'district', nullable: true })
  district: string;

  @Column({ name: 'address', nullable: true })
  address: string;

  @Column({ name: 'postal_code', nullable: true })
  postalCode: string;

  @Column({ name: 'telephone', nullable: true })
  telephone: string;

  @Column({ name: 'last_login', type: 'timestamp with time zone', nullable: true })
  lastLogin: Date;

  @Column({ name: 'last_login_ip', nullable: true })
  lastLoginIP: string;

  @Column({ name: 'registered_ip', nullable: true })
  registeredIP: string;

  @Column({ name: 'restore_password_token', nullable: true })
  restorePasswordToken: string;

  @Column({ name: 'restore_password_date', type: 'timestamp with time zone', nullable: true })
  restorePasswordDate: Date;

  @Column({ name: 'is_valid_password_token', default: false })
  isValidPasswordToken: boolean;

  @Column({ name: 'refresh_token', nullable: true })
  refreshToken: string;

  @Column({ name: 'refresh_token_emit_date', type: 'timestamp with time zone', nullable: true })
  refreshTokenEmitDate: Date;
}
