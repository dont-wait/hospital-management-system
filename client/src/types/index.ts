export interface Employee {
  ep_id: string;
  ep_firstname: string;
  ep_lastname: string;
  ep_dob: string;
  ep_gender: "Male" | "Female" | "Other";
  ep_phonenumber: string;
  ep_hire_date: string;
  ep_certificate_number: string;
  email: string;
  role_id: string;
}

export interface Role {
  role_id: string;
  role_description: string;
}

export interface AuthUser {
  userAccount: Account;
  profile: Employee;
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

export type Gender = "Male" | "Female" | "Other";

export interface Patient {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  gender: Gender;
  placeOfResidence: string;
  address: string;
  phoneNumber: string;
}

export interface PatientRegisterData {
  patientInfo: Patient;
  accountInfo: Account;
}

export interface PatientRegisterSchema {
  // account info
  username: string;
  password: string;

  // patient info
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  email: string;
  gender: Gender;
  placeOfResidence: string;
  address: string;
  contactNumber: string;
}
