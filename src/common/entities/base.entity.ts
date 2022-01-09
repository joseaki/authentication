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
} from 'interfaces/IUniversal';
import { PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, DeleteDateColumn } from 'typeorm';

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
    ICommentParam
{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'created_by', nullable: true, type: 'varchar', length: 300 })
  createdBy: string;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ name: 'update_by', nullable: true, type: 'varchar', length: 300 })
  updatedBy: string;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date;

  @Column({ name: 'deleted_by', type: 'varchar', length: 300, nullable: true })
  deletedBy: string;

  @Column({ name: 'internal_comment', type: 'varchar', length: 300, nullable: true })
  internalComment: string | null;
}
