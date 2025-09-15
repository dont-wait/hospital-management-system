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

export interface LoginPatientDto {
  citizenID: string;
  password: string;
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
