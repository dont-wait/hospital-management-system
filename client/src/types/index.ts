export interface UserAccount {
  ua_id: string;
  ua_avatar?: string;
  ua_username: string;
  ua_password: string;
  is_active: boolean;
  pt_id?: string;
  ep_id?: string;
}

export interface Patient {
  pt_id: string;
  pt_firstname: string;
  pt_lastname: string;
  pt_dob: string;
  pt_nationality: string;
  email: string;
  pt_gender: "Male" | "Female" | "Other";
  pt_place_of_residence: string;
  pt_is_insurance: boolean;
  pt_contact_number: string;
  pt_registration_date: string;
  role_id: string;
}

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
  userAccount: UserAccount;
  profile: Patient | Employee;
  role: Role;
}

export interface LoginCredentials {
  username: string;
  password: string;
  idCard?: File;
}

export interface RegisterData {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: "Male" | "Female" | "Other";
  contactNumber: string;
  nationality?: string;
  placeOfResidence?: string;
  isInsurance?: boolean;
}
