import { AuthUserWithoutTokens } from "@/types";

export const roleIdToName: Record<string, string> = {
    "admin": "Quản trị viên",
    "doctor": "Bác sĩ",
    "patient": "Bệnh nhân",
};

export const getUserRole = (user: AuthUserWithoutTokens): string => {
    if (user.patient) return roleIdToName.patient;
    if (user.employee) return roleIdToName[user.employee.roleId] || "Không rõ";
    return "Không rõ";
};

export const getUserName = (user: AuthUserWithoutTokens): string => {
    if (user.employee) return `${user.employee.lastName} ${user.employee.firstName}`;
    if (user.patient) return `${user.patient.lastName} ${user.patient.firstName}`;
    return "N/A";
};

export const getUserEmail = (user: AuthUserWithoutTokens): string => {
    if (user.employee) return user.employee.email;
    if (user.patient) return user.patient.email;
    return "N/A";
};

export const getUserPhone = (user: AuthUserWithoutTokens): string => {
    if (user.employee) return user.employee.phoneNumber;
    if (user.patient) return user.patient.phoneNumber;
    return "N/A";
};