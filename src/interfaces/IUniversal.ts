export interface IIdParam {
  id: number;
}
export interface IStatusParams {
  isActive: boolean;
  isArchived: boolean;
}

export interface ICreateDateParam {
  createdAt: Date;
}

export interface ICreateUserParam {
  createdBy: string;
}

export interface IUpdateDateParam {
  updatedAt: Date;
}
export interface IUpdateUserParam {
  updatedBy: string;
}

export interface IDeletedDateParam {
  deletedAt: Date;
}

export interface IDeletedUserParam {
  deletedBy: string;
}

export interface ICommentParam {
  internalComment: string;
}
