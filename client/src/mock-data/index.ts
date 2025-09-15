import { Patient, Doctor, AuthUser, Gender } from "@/types";

// Mock Patient
const mockPatient: Patient = {
  patientId: "P001",
  firstName: "Minh",
  lastName: "Nguyen",
  email: "minh.nguyen@example.com",
  phoneNumber: "+84901234567",
  dateOfBirth: "1995-08-15",
  gender: Gender.Male,
  nationality: "Vietnamese",
  address: "123 Nguyen Trai, District 1, Ho Chi Minh City",
  placeOfResidence: "Ho Chi Minh City",
};

// Mock Doctor
const mockDoctor: Doctor = {
  doctorId: "D001",
  specialization: "Cardiology",
  firstName: "Lan",
  lastName: "Tran",
  dateOfBirth: "1980-03-25",
  gender: Gender.Female,
  phoneNumber: "+84987654321",
  email: "lan.tran@hospital.com",
  hireDate: "2010-06-01",
  certificateNumber: "CERT123456",
};

// AuthUser mock với Patient
const mockAuthPatient: AuthUser = {
  userAccountId: "U001",
  citizenID: "012345678901",
  avatarUrl: "https://example.com/avatar-patient.jpg",
  is_Active: true,
  user: mockPatient,
  accessToken: "mockAccessToken_patient_123",
  refreshToken: "mockRefreshToken_patient_123",
};

// AuthUser mock với Doctor
const mockAuthDoctor: AuthUser = {
  userAccountId: "U002",
  citizenID: "2345678901",
  avatarUrl: "https://example.com/avatar-doctor.jpg",
  is_Active: true,
  user: mockDoctor,
  accessToken: "mockAccessToken_doctor_456",
  refreshToken: "mockRefreshToken_doctor_456",
};

export const mockData = [mockAuthDoctor, mockAuthPatient];
