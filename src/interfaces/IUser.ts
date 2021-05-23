export interface IClientId {
  clientId: number;
}

export interface ICompleteUserRegistration extends IClientId {
  name: string;
  lastname: string;
  username?: string;
  displayname?: string;
  birthday?: Date;
  gender?: string;
  district?: string;
  address?: string;
  postCode?: string;
  telephone?: string;
}

export interface IUserMetadata {
  lastLogin?: Date;
  lastLoginIP?: string;
  registeredIP?: string;
}

export interface IUserEmail {
  email: string;
}

export interface IUserPassword {
  password: string;
}

export interface IUserComplete {
  isComplete: boolean;
}

export interface IRestorePassword {
  restorePasswordToken: string;
  restorePasswordDate: Date;
  isValidPasswordToken: boolean;
}

export interface IUserRegistration extends IUserEmail, IUserPassword {}

export interface IUserCompleteRegistration
  extends IUserRegistration,
    IClientId {}

export interface IUserPasswordUpdate {
  token: string;
  password: string;
}
