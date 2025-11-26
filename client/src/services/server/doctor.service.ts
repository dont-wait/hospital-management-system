import "server-only";
import { getApiInstance, getConfig } from "@/axios";
import { Doctor, Gender, AuthUserWithoutTokens } from "@/types";

const doctors: Doctor[] = [
  {
    doctorId: "DOC001",
    specialization: "Tim mạch",
    firstName: "Nguyen",
    lastName: "Van A",
    dateOfBirth: "1980-05-20",
    gender: Gender.Male,
    phoneNumber: "0901234567",
    email: "vana@example.com",
    hireDate: "2010-01-10",
    certificateNumber: "CERT-TM-001",
  },
  {
    doctorId: "DOC002",
    specialization: "Nhi khoa",
    firstName: "Tran",
    lastName: "Thi B",
    dateOfBirth: "1985-09-12",
    gender: Gender.Female,
    phoneNumber: "0912345678",
    email: "thib@example.com",
    hireDate: "2012-04-18",
    certificateNumber: "CERT-NK-002",
  },
  {
    doctorId: "DOC003",
    specialization: "Da liễu",
    firstName: "Le",
    lastName: "Van C",
    dateOfBirth: "1978-11-03",
    gender: Gender.Male,
    phoneNumber: "0987654321",
    email: "vanc@example.com",
    hireDate: "2008-07-22",
    certificateNumber: "CERT-DL-003",
  },
  {
    doctorId: "DOC004",
    specialization: "Ngoại tổng quát",
    firstName: "Pham",
    lastName: "Thi D",
    dateOfBirth: "1990-02-15",
    gender: Gender.Female,
    phoneNumber: "0934567890",
    email: "thid@example.com",
    hireDate: "2015-03-11",
    certificateNumber: "CERT-NGTQ-004",
  },
  {
    doctorId: "DOC005",
    specialization: "Tai mũi họng",
    firstName: "Hoang",
    lastName: "Van E",
    dateOfBirth: "1982-07-07",
    gender: Gender.Male,
    phoneNumber: "0945678901",
    email: "vane@example.com",
    hireDate: "2011-09-30",
    certificateNumber: "CERT-TMH-005",
  },
  {
    doctorId: "DOC006",
    specialization: "Nội tiết",
    firstName: "Do",
    lastName: "Thi F",
    dateOfBirth: "1987-12-25",
    gender: Gender.Female,
    phoneNumber: "0956789012",
    email: "thif@example.com",
    hireDate: "2016-05-14",
    certificateNumber: "CERT-NT-006",
  },
];

export class DoctorService {
  public static async getDoctorInfo(
    token?: string,
  ): Promise<AuthUserWithoutTokens> {
    const apiInstance = getApiInstance();
    const config = getConfig(token);
    const response = await apiInstance.get("account/@me", config);
    return response.data.data;
  }

  public static async getDoctors(specialty: string = ""): Promise<Doctor[]> {
    return doctors.filter((doctor) =>
      doctor.specialization.includes(specialty),
    );
  }
}
