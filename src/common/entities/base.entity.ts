import {
  IIdParam,
  IStatusParams,
  ICreateDateParam,
  ICreateUserParam,
  IDeletedDateParam,
  IDeletedUserParam,
  IUpdateDateParam,
  IUpdateUserParam,
  ICommentParam,
} from '../../Interfaces/IUniversal';
import {
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export abstract class BaseEntity
  implements
    IIdParam,
    IStatusParams,
    ICreateDateParam,
    ICreateUserParam,
    IDeletedDateParam,
    IDeletedUserParam,
    IUpdateDateParam,
    IUpdateUserParam,
    ICommentParam {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isArchived: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'varchar', length: 300 })
  createdBy: string;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'varchar', length: 300 })
  updatedBy: string;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ type: 'varchar', length: 300, nullable: true })
  deletedBy: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  internalComment: string | null;
}
