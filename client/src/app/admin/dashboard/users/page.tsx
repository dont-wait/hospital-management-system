import { cookies } from "next/headers";
import AdminContentHeader from "@/components/admin/AdminContentHeader";
import UserSearch from "@/components/admin/UserSearch";
import UserRoleButton from "@/components/admin/UserRoleButton";
import UserAddButton from "@/components/admin/UserAddButton";
import UserTableHeader from "@/components/admin/UserTableHeader";
import UserTableBody from "@/components/admin/UserTableBody";
import { EmployeeService } from "@/services/employee.service";
import userStyles from "@/styles/admin-user-management.module.css";
import styles from "@/styles/admin.module.css";

async function UsersManagementPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  const users =
    (await EmployeeService.getAllEmployees("doctor", undefined, token)) ?? [];
  return (
    <div className={styles["admin-container"]}>
      <AdminContentHeader
        title="Quản lý người dùng"
        description="Quản lý tất cả người dùng trong hệ thống bệnh viện"
      />
      <div className={styles["admin-container"]}>
        <div className={userStyles["users-table-container"]}>
          <div className={userStyles["table-header"]}>
            <h2 className={userStyles["table-title"]}>Danh sách người dùng</h2>
            <div className="flex gap-3">
              <UserSearch />
              <UserRoleButton />
              <UserAddButton />
            </div>
          </div>
          <div className={userStyles["table-wrapper"]}>
            <table className={userStyles["users-table"]}>
              <UserTableHeader />
              <UserTableBody users={users} />
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UsersManagementPage;
