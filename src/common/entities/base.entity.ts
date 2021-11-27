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
} from 'src/interfaces/IUniversal';
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

  @Column({ type: 'tinyint', default: true })
  isActive: boolean;

  @Column({ type: 'tinyint', default: false })
  isArchived: boolean;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'varchar', length: 300, nullable: true })
  createdBy: string;

  @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'varchar', length: 300, nullable: true })
  updatedBy: string;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ type: 'varchar', length: 300, nullable: true })
  deletedBy: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  internalComment: string | null;
}
