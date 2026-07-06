import { RolesList, Roles, AuthUserWithoutTokens } from "@/types";

export class UserManagementUtils {
  public static RoleNames: Record<string, string> = {
    admin: "Quản trị viên",
    doctor: "Bác sĩ",
    hod: "Trưởng khoa",
    patient: "Bệnh nhân",
    sys: "Quản trị hệ thống",
  };

  public static getVisibleRoles(): Exclude<Roles, "admin" | "guest">[] {
    return RolesList.filter(
      (r): r is Exclude<Roles, "admin" | "guest"> =>
        r !== "admin" && r !== "guest",
    );
  }

  public static getUserRole(user: AuthUserWithoutTokens): string {
    if (user.patient) return UserManagementUtils.RoleNames["patient"];
    if (user.employee)
      return UserManagementUtils.RoleNames[user.employee.roleId] || "Không rõ";
    return "Không rõ";
  }

  public static getUserName(user: AuthUserWithoutTokens): string {
    if (user.employee)
      return `${user.employee.lastName} ${user.employee.firstName}`;
    if (user.patient)
      return `${user.patient.lastName} ${user.patient.firstName}`;
    return "N/A";
  }

  public static getUserEmail(user: AuthUserWithoutTokens): string {
    if (user.employee) return user.employee.email;
    if (user.patient) return user.patient.email;
    return "N/A";
  }

  public static getUserPhone(user: AuthUserWithoutTokens): string {
    if (user.employee) return user.employee.phoneNumber;
    if (user.patient) return user.patient.phoneNumber;
    return "N/A";
  }
}
