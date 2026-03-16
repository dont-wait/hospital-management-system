import { describe, it, expect, vi, afterEach } from "vitest";
import { AuthService } from "@/services/auth.service";
import { api } from "@/axios";
import { TokenUtils } from "@/lib/client";
import { Gender } from "@/types";
import {LoginAccountDto} from "@/schemas/auth";

describe("AuthService.login (Vitest)", () => {
  const loginDto: LoginAccountDto= {
    citizenID: "000000000001",
    password: "123456",
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("✅ login thành công với PATIENT", async () => {
    vi.mocked(api.post).mockResolvedValue({
      data: {
        status: 200,
        message: "Login success",
        data: {
          userAccountId: "UA001",
          citizenID: "123456789",
          avatarUrl: "patient.png",
          is_Active: true,
          accessToken: "access-token",
          refreshToken: "refresh-token",
          employee: null,
          patient: {
            patientId: "P001",
            firstName: "Nguyen",
            lastName: "An",
            email: "patient@test.com",
            phoneNumber: "0123456789",
            dateOfBirth: "2000-01-01",
            gender: Gender.Male,
            nationality: "VN",
            address: "HCM",
            placeOfResidence: "HCM",
            avatarUrl: "patient.png",
          },
        },
      },
    });

    const result = await AuthService.login(loginDto);

    expect(api.post).toHaveBeenCalledWith("auth/login", loginDto);

    expect(TokenUtils.saveUser).toHaveBeenCalledWith({
      patientId: "P001",
      firstName: "Nguyen",
      lastName: "An",
      email: "patient@test.com",
      phoneNumber: "0123456789",
      dateOfBirth: "2000-01-01",
      gender: Gender.Male,
      nationality: "VN",
      address: "HCM",
      placeOfResidence: "HCM",
      avatarUrl: "patient.png",
    });

    expect(result?.firstName).toBe("Nguyen");
  });

  it("✅ login thành công với EMPLOYEE", async () => {
    vi.mocked(api.post).mockResolvedValue({
      data: {
        status: 200,
        message: "Login success",
        data: {
          userAccountId: "UA002",
          citizenID: "987654321",
          avatarUrl: "employee.png",
          is_Active: true,
          accessToken: "access-token",
          refreshToken: "refresh-token",
          patient: null,
          employee: {
            employeeId: "E001",
            doctorId: "D001",
            firstName: "Tran",
            lastName: "Binh",
            dateOfBirth: "1990-01-01",
            gender: "M",
            phoneNumber: "0987654321",
            email: "doctor@test.com",
            hireDate: "2020-01-01",
            certificateNumber: "CERT123",
            specialization: "Cardiology",
            departmentId: 1,
            departmentName: "Tim mạch",
            avatarUrl: "employee.png",
            roleId: "doctor",
          },
        },
      },
    });

    const result = await AuthService.login(loginDto);

    expect(TokenUtils.saveUser).toHaveBeenCalled();
    expect(result?.email).toBe("doctor@test.com");
  });

  it("❌ login không có patient & employee → null", async () => {
    vi.mocked(api.post).mockResolvedValue({
      data: {
        status: 200,
        message: "Login success",
        data: {
          patient: null,
          employee: null,
        },
      },
    });

    const result = await AuthService.login(loginDto);

    expect(result).toBeNull();
    expect(TokenUtils.saveUser).not.toHaveBeenCalled();
  });
});
