export interface Role {
  role_id: string;
  role_description: string;
}

export interface AuthUser {
  userAccount: Account;
  role: Role;
  token?: string;
  refreshToken?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  idCard?: File;
}

export interface Account {
  citizenID: string;
  password: string;
  confirmPassword: string;
}

export enum Gender {
  Male = "M",
  Female = "F",
  Other = "O",
}

export interface RegisterPatientDto {
  citizenID: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}
