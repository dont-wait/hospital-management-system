"use client";

import { useEffect, useMemo, useState } from "react";
import { useUserManagementContext } from "@/contexts";
import { AuthUserWithoutTokens } from "@/types";
import { EmployeeService } from "@/services/employee.service";
import { PatientService } from "@/services/patient.service";
import { UserManagementUtils } from "@/lib/client";
import UserTableHeader from "@/components/admin/UserTableHeader";
import UserTableBody from "@/components/admin/UserTableBody";
import Pagination from "@/components/shared/Pagination";
import userStyles from "@/styles/admin-user-management.module.css";

const PAGE_SIZE = 10;

export default function UserTableContainer() {
  const { state } = useUserManagementContext();
  const [users, setUsers] = useState<AuthUserWithoutTokens[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);

      try {
        const data =
          state.selectedRole === "patient"
            ? await PatientService.getAllPatients()
            : await EmployeeService.getAllEmployees(state.selectedRole);
        setUsers(data ?? []);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [state.selectedRole, state.refreshKey]);

  const filteredUsers = useMemo(() => {
    const search = state.searchTerm.toLowerCase();

    return users.filter((user) => {
      const name = UserManagementUtils.getUserName(user).toLowerCase();
      const email = UserManagementUtils.getUserEmail(user).toLowerCase();
      const phone = UserManagementUtils.getUserPhone(user);
      const citizenID = user.citizenID.toLowerCase();

      return (
        name.includes(search) ||
        email.includes(search) ||
        phone.includes(search) ||
        citizenID.includes(search)
      );
    });
  }, [users, state.searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredUsers.slice(startIndex, startIndex + PAGE_SIZE);
  }, [currentPage, filteredUsers]);

  useEffect(() => {
    setCurrentPage(1);
  }, [state.selectedRole, state.searchTerm]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div className={userStyles["table-wrapper"]}>
      <table className={userStyles["users-table"]}>
        <UserTableHeader />
        {isLoading ? (
          <tbody>
            <tr className={userStyles["empty-state"]}>
              <td colSpan={8}>Đang tải danh sách người dùng...</td>
            </tr>
          </tbody>
        ) : !filteredUsers.length ? (
          <tbody>
            <tr className={userStyles["empty-state"]}>
              <td colSpan={8}>
                {state.searchTerm
                  ? `Không tìm thấy người dùng nào với từ khóa "${state.searchTerm}"`
                  : "Không có người dùng nào trong hệ thống"}
              </td>
            </tr>
          </tbody>
        ) : (
          <UserTableBody users={paginatedUsers} />
        )}
      </table>
      {!isLoading && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
}
