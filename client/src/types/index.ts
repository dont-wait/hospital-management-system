import { ReactNode } from "react";
import type Lucide from "lucide-react";

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export enum Gender {
  Male = "M",
  Female = "F",
  Other = "O",
}

export const RolesList = [
  "admin",
  "guest",
  "doctor",
  "patient",
  "hod",
] as const;

export type Roles = (typeof RolesList)[number];

export interface Patient {
  patientId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: Gender;
  nationality: string;
  address: string;
  placeOfResidence: string;
  avatarUrl: string;
}

export interface Doctor {
  doctorId: string;
  specialization: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  phoneNumber: string;
  email: string;
  hireDate: string;
  certificateNumber: string;
}

export interface Employee {
  employeeId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  email: string;
  hireDate: string;
  certificateNumber: string;
  specialization: string;
  departmentId: number;
  departmentName: string;
  avatarUrl: string;
  roleId: Roles;
}

export interface AuthUser {
  userAccountId: string;
  citizenID: string;
  avatarUrl: string;
  is_Active: boolean;
  patient: Patient | null;
  employee: Employee | null;
  accessToken: string;
  refreshToken: string;
}

export type AuthUserWithoutTokens = Omit<
  AuthUser,
  "accessToken" | "refreshToken"
>;

export interface LoginResponse {
  status: number;
  message: string;
  data: AuthUser;
}

export interface RegisterResponse {
  status: number;
  message: string;
  data: Patient;
}

export interface LogoutResponse {
  status: number;
  message: string;
}

export interface AuthErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
}

export type forgotPasswordStep = "send" | "verify" | "reset";

export interface ResetPasswordState {
  step: forgotPasswordStep;
  email: string;
  otp: string;
  maxRetries: number;
}

export interface OtpDto {
  email: string;
  otp: string;
}

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
  showCloseButton?: boolean;
};
export interface WorkShift {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  description: string;
  shiftStatus: "Scheduled" | "Completed" | "Canceled";
  attendanceStatus?: "checked-in" | "late" | "not-checked-in" | "checked-out";
  actualCheckInTime?: string;
}

export type IconNames = keyof typeof Lucide.icons;

export interface BookingSteps {
  id: string;
  label: string;
}

export type Priority = "department" | "doctor" | "date";

export type BookingDoctor = Pick<Doctor, "doctorId" | "specialization"> & {
  fullName: string;
};

export interface BaseBookingInfo {
  patient: Patient;
  specialty: string;
  doctor: BookingDoctor;
  date: string;
  timeSlot: string;
  roomName: string;
  price: number;
}

export interface BookingRecord {
  patient: Patient;
  departmentId: number;
  departmentName: string;
  doctor: BookingDoctor;
  date: string;
  slotTime: string;
  slotTimeId: number;
  roomName: string;
  price: number;
}

export interface BookingData {
  step: number;
  patient: Patient | null;
  priority: Priority | null;
  departmentId: number | null;
  departmentName: string;
  doctor: BookingDoctor | null;
  date: string;
  slotTimeId: number | null;
  slotTime: string;
  roomName: string;
  records: BookingRecord[];
  price: number;
  insurance: string;
}

export interface PriorityOption {
  id: Priority;
  label: string;
  description: string;
  iconName: IconNames;
}

export interface Department {
  departmentId: number;
  departmentName: string;
  departmentLocation: string;
  departmentDescription: string;
}

export type DepartmentInfo = Pick<
  Department,
  "departmentId" | "departmentName" | "departmentDescription"
>;

export type ScheduleStatus = "Opened" | "Closed" | "Full";

export interface Slot {
  slotId: number;
  slotStatus: ScheduleStatus;
  slotStartTime: string;
  slotEndTime: string;
}

export interface Schedule {
  scheduleId: number;
  startTime: string;
  endTime: string;
  scheduleStatus: ScheduleStatus;
  doctorId: string;
  departmentId: number;
  departmentName: string;
  departmentDescription: string;
  roomName: string;
  fullName: string;
  specialization: string;
  slots: Slot[];
}

export interface ScheduleData {
  date: string;
  departmentId: number | null;
  departmentName: string;
  departmentDescription: string;
  priceOfService: number;
  doctorId: number | null;
  schedules: Schedule[];
}

export interface CalendarDay {
  day: string;
  dateString: string;
  isDisabled: boolean;
}

export interface DateTime {
  time: string;
  date: string;
}

export interface DateFields {
  day: string;
  month: string;
  year: string;
}

export type DateFormatType =
  | "FullDate"
  | "DayMonth"
  | "DayMonthYear"
  | "Time"
  | "WeekdayShort";

export type ModalType = "view" | "update" | null;

export interface UserListState {
  isDropdownOpen: boolean;
  selectedRole: Exclude<Roles, "admin" | "guest">;
  searchTerm: string;
  selectedUser: AuthUserWithoutTokens | null;
  activeModal: ModalType;
}

export interface Room {
  id: number;
  name: string;
  capacity: number;
}

export interface SelectOption {
  value: string;
  label: string;
}

export const WORK_SHIFTS: readonly SelectOption[] = [
  { value: "0", label: "Ca sáng (7h - 12h)" },
  { value: "1", label: "Ca chiều (13h - 17h)" },
] as const;

export type AppointmentInfo = Pick<
  BookingRecord,
  "departmentId" | "slotTimeId"
> & {
  appointmentDate: string;
  doctorId: string;
};

export interface AppointmentDto {
  patientId: string;
  appointmentSlots: AppointmentInfo[];
}

export interface ApiError {
  status: number;
  message: string;
}

export interface RevenueByDepartment {
  id: number;
  name: string;
  revenue: number;
  totalAppointments: number;
  revenueGrowthPercentage: number | null;
}

export interface RevenueTransaction {
  patientName: string;
  serviceName: string;
  amount: number;
  transactionDate: string;
  status: "paid" | "unpaid" | "pending" | "failed";
}

export interface ChartLineData {
  label: string;
  revenue: number;
}

export interface ChartDataCategory {
  appointments: number;
  services: number;
}
export interface Appointment {
  appointmentId: number;
  billingId: number;
  departmentName: string;
  roomName: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  appointmentDate: string;
  appointmentStartTime: string;
  appointmentEndTime: string;
  priceOfService: number;
  appointmentStatus: string;
  doctorName: string;
}

export interface AppointmentDetail {
  appointmentId: number;
  billingId: number;
  departmentName: string;
  roomName: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  appointmentDate: string;
  appointmentStartTime: string;
  appointmentEndTime: string;
  priceOfService: number;
  appointmentStatus: string;
  doctorName: string;
}

export interface ApiResponseWithPaging<T> extends ApiResponse<T> {
  size: number;
  page: number;
  totalPages: number;
}

export interface Billing {
  id: number;
  discountAmount: number;
  paymentAmount: number;
  paymentMethod: string;
  billingStatus: string;
}

export interface BillingDetail extends Billing {
  createdAt: string;
  serviceName: string;
}

export interface BackupInfo {
  id: number;
  backupType: "FULL" | "DIFF" | "LOG";
  actionBy: "manual" | "auto";
  backupDate: string;
  fileName: string;
  status: "SUCCESS" | "FAILED";
  createdDate: string;
}

export interface BackupFileMetadata {
  databaseName: string;
  backupType: number; // 1=FULL, 5=DIFF, 2=LOG
  backupTypeText: "FULL" | "DIFF" | "LOG" | "UNKNOWN";
  fileName: string;
  firstLSN: number;
  lastLSN: number;
  databaseBackupLSN: number;
  differentialBaseLSN: number | null;
  checkpointLSN: number;
  backupStartDate: string;
  backupFinishDate: string;
  backupSize: number;
  isCompressed: boolean;
  position: number;
  isCopyOnly: boolean;
  recoveryModel: string;
  softwareVersionMajor: string;
  orderInChain: number;
  validationErrors: string[];
  isValid: boolean;
}

export interface BackupChainValidation {
  isValid: boolean;
  hasFullBackup: boolean;
  fullBackupFileName: string | null;
  hasDifferentialBackup: boolean;
  differentialBackupFileName: string | null;
  differentialMatchesBase: boolean;
  logBackupCount: number;
  logChainContinuous: boolean;
  errors: string[];
  warnings: string[];
  recommendedRestoreOrder: string[];
}

export interface InspectBackupRequest {
  backupPath: string;
  fileNames: string[];
}

export interface InspectBackupResponse {
  metadata: BackupFileMetadata[];
  validation: BackupChainValidation;
}

export interface RestoreDatabaseRequest {
  databaseName: string;
  backupPath: string;
  backupFiles: string[];
  stopAt: string | null;
  withRecovery: boolean;
  forceReplace: boolean;
}

export interface RestoreStep {
  stepNumber: number;
  backupType: string;
  fileName: string;
  startTime: string;
  endTime: string;
  status: "SUCCESS" | "FAILED";
  message: string;
}

export interface RestoreDatabaseResponse {
  databaseName: string;
  startTime: string;
  endTime: string;
  durationInSeconds: number;
  steps: RestoreStep[];
  status: "SUCCESS" | "FAILED" | "PARTIAL";
  message: string;
}