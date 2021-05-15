import { BaseEntity } from 'src/common/entities/base.entity';
import {
  IClientId,
  ICompleteUserRegistration,
  IUserComplete,
  IUserMetadata,
  IUserRegistration,
} from 'src/interfaces/IUser';
import { ChildEntity, Column, Entity, TableInheritance } from 'typeorm';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class User
  extends BaseEntity
  implements IUserRegistration, IUserComplete, IClientId {
  @Column({ type: 'boolean', default: false })
  isComplete: boolean;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: false })
  clientId: number;
}

@ChildEntity()
export class CompleteUserInfo
  extends User
  implements ICompleteUserRegistration, IUserMetadata {
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
}
