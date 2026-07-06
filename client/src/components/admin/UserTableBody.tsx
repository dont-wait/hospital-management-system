"use client";

import Image from "next/image";
import Icon from "@/components/shared/Icon";
import { useUserManagementContext } from "@/contexts";
import { UserManagementUtils } from "@/lib/client";
import { AuthUserWithoutTokens } from "@/types";
import userStyles from "@/styles/admin-user-management.module.css";

interface UserTableBodyProps {
  users: AuthUserWithoutTokens[];
}

export default function UserTableBody({ users }: UserTableBodyProps) {
  const { viewUser, updateUser } = useUserManagementContext();

  return (
    <tbody>
      {users.map((user) => (
        <tr key={user.userAccountId}>
          <td>
            <Image
              src={user.avatarUrl}
              width={30}
              height={30}
              alt={UserManagementUtils.getUserName(user)}
              className={userStyles["avatar"]}
            />
          </td>
          <td className={userStyles["user-name"]}>
            {UserManagementUtils.getUserName(user)}
          </td>
          <td>{user.citizenID}</td>
          <td>{UserManagementUtils.getUserEmail(user)}</td>
          <td>{UserManagementUtils.getUserPhone(user)}</td>
          <td>
            <span
              className={`${userStyles["role-badge"]} ${
                user.employee
                  ? userStyles["role-employee"]
                  : userStyles["role-patient"]
              }`}
            >
              {UserManagementUtils.getUserRole(user)}
            </span>
          </td>
          <td>
            <div className={`${userStyles["status"]}`}>
              <div
                className={`${user.is_Active ? userStyles["status-active"] : userStyles["status-inactive"]}`}
              ></div>
              {user.is_Active ? "Đang hoạt động" : "Vô hiệu hóa"}
            </div>
          </td>
          <td>
            <div className={userStyles["action-buttons"]}>
              <button
                className={userStyles["btn-view"]}
                onClick={() => {
                  viewUser(user);
                }}
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <Icon name="Eye" className="w-full h-full" />
                </div>
              </button>
              <button
                className={userStyles["btn-edit"]}
                onClick={() => {
                  updateUser(user);
                }}
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <Icon name="SquarePen" className="w-full h-full" />
                </div>
              </button>
              <button className={userStyles["btn-delete"]}>
                <div className="w-4 h-4 flex items-center justify-center">
                  <Icon name="Trash2" className="w-full h-full" />
                </div>
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );
}
