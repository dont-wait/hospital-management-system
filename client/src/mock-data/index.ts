import { AuthUser } from '@/types';

export const mockUsers: AuthUser[] = [
  {
    userAccount: {
      username: "doctor@hospital.com",
      password: "doctor123",
      isActive: 1,
    },
    profile: {
      ep_id: "1",
      ep_firstname: "Dr. John",
      ep_lastname: "Smith",
      ep_dob: "1985-03-15",
      ep_gender: "Male",
      ep_phonenumber: "+1234567890",
      ep_hire_date: "2020-01-15",
      ep_certificate_number: "DOC12345",
      email: "doctor@hospital.com",
      role_id: "doctor",
    },
    role: {
      role_id: "doctor",
      role_description: "doctor",
    },
  },
  {
    userAccount: {
      username: "patient@hospital.com",
      password: "patient123",
      isActive: 1,
    },
    profile: {
      ep_id: "2",
      ep_firstname: "Jane",
      ep_lastname: "Doe",
      ep_dob: "1990-07-20",
      ep_gender: "Female",
      ep_phonenumber: "+1987654321",
      ep_hire_date: "2024-01-10",
      ep_certificate_number: "",
      email: "patient@hospital.com",
      role_id: "patient",
    },
    role: {
      role_id: "patient",
      role_description: "patient",
    },
  },
  {
    userAccount: {
      username: "admin@hospital.com",
      password: "admin123",
      isActive: 1,
    },
    profile: {
      ep_id: "3",
      ep_firstname: "Admin",
      ep_lastname: "User",
      ep_dob: "1980-01-01",
      ep_gender: "Male",
      ep_phonenumber: "+1111111111",
      ep_hire_date: "2019-01-01",
      ep_certificate_number: "ADMIN001",
      email: "admin@hospital.com",
      role_id: "3",
    },
    role: {
      role_id: "admin",
      role_description: "admin",
    },
  },
];
