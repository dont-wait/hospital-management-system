"use client";

import { AuthUserWithoutTokens, roles, Role } from "@/types";
import styles from "@/styles/admin.module.css";
import userStyles from "@/styles/admin-user-management.module.css";
import { Eye, SquarePen, Trash2, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface UserListProps { 
    users: AuthUserWithoutTokens[];
}

const visibleRoles = roles.filter(
(r): r is Exclude<Role, "admin" | "guest"> => r !== "admin" && r !== "guest"
);

const roleIdToName: Record<string, string> = {
    "admin": "Quản trị viên",
    "doctor": "Bác sĩ",
    "patient": "Bệnh nhân",
};

export function UserList({ users }: UserListProps) {
const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [selectedRole, setSelectedRole] = useState<Exclude<Role, "admin" | "guest">>("doctor");

    // Đóng dropdown khi click bên ngoài
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    
    const getUserRole = (user: AuthUserWithoutTokens): string => {
        if (user.patient) return roleIdToName.patient;
        if (user.employee) return roleIdToName[user.employee.roleId] || "Không rõ";
        return "Không rõ";
    };

    const getUserName = (user: AuthUserWithoutTokens): string => {
        if (user.employee) return `${user.employee.lastName} ${user.employee.firstName}`;
        if (user.patient) return `${user.patient.lastName} ${user.patient.firstName}`;
        return "N/A";
    };

    const getUserEmail = (user: AuthUserWithoutTokens): string => {
        if (user.employee) return user.employee.email;
        if (user.patient) return user.patient.email;
        return "N/A";
    };

    const getUserPhone = (user: AuthUserWithoutTokens): string => {
        if (user.employee) return user.employee.phoneNumber;
        if (user.patient) return user.patient.phoneNumber;
        return "N/A";
    };

    return (
        <div className={styles["admin-container"]}>
            <div className={styles["dashboard-header"]}>
                <h1 className={styles["dashboard-title"]}>Quản lý người dùng</h1>
                <p className={styles["dashboard-subtitle"]}>
                    Quản lý tất cả người dùng trong hệ thống bệnh viện
                </p>
            </div>

            <div className={userStyles["users-table-container"]}>
                <div className={userStyles["table-header"]}>
                    <h2 className={userStyles["table-title"]}>Danh sách người dùng</h2>
                    <div className="flex gap-3">
                        <div className={userStyles["dropdown-container"]} ref={dropdownRef}>
                            <button 
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className={userStyles["dropdown-btn"]}
                                type="button"
                            >
                                {roleIdToName[selectedRole] || selectedRole}
                                <ChevronDown className={`${userStyles["dropdown-icon"]} ${isDropdownOpen ? userStyles["dropdown-icon-open"] : ''}`} />
                            </button>
                            
                            {isDropdownOpen && (
                                <div className={userStyles["dropdown-menu"]}>
                                    <ul>
                                        {
                                            visibleRoles.map((role => (
                                                <li key={role}>
                                                    <button 
                                                        onClick={() => {
                                                            setIsDropdownOpen(false);
                                                            setSelectedRole(role);
                                                        }}
                                                        className={userStyles["dropdown-menu-item"]}
                                                    >
                                                        {roleIdToName[role] || role}
                                                    </button>
                                                </li>
                                            )))
                                        }
                                    </ul>
                                </div>
                            )}
                        </div>
                        
                        <button className={userStyles["add-user-btn"]}>
                            <span>+</span> Thêm người dùng
                        </button>   
                    </div>
                </div>

                <div className={userStyles["table-wrapper"]}>
                    <table className={userStyles["users-table"]}>
                        <thead>
                            <tr>
                                <th>Avatar</th>
                                <th>Họ và tên</th>
                                <th>CCCD</th>
                                <th>Email</th>
                                <th>Số điện thoại</th>
                                <th>Vai trò</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.userAccountId}>
                                    <td>
                                        <img 
                                            src={user.avatarUrl} 
                                            alt={getUserName(user)}
                                            className={userStyles["avatar"]}
                                        />
                                    </td>
                                    <td className={userStyles["user-name"]}>{getUserName(user)}</td>
                                    <td>{user.citizenID}</td>
                                    <td>{getUserEmail(user)}</td>
                                    <td>{getUserPhone(user)}</td>
                                    <td>
                                        <span className={`${userStyles["role-badge"]} ${
                                            user.employee ? userStyles["role-employee"] : userStyles["role-patient"]
                                        }`}>
                                            {getUserRole(user)}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={`${userStyles["status"]}`}>
                                            <div className={`${user.is_Active ? userStyles["status-active"] : userStyles["status-inactive"]}`}></div>
                                            {user.is_Active ? "Đang hoạt động" : "Vô hiệu hóa"}
                                        </div>
                                    </td>
                                    <td>
                                        <div className={userStyles["action-buttons"]}>
                                            <button className={userStyles["btn-view"]} title="Xem chi tiết">
                                                <Eye />
                                            </button>
                                            <button className={userStyles["btn-edit"]} title="Chỉnh sửa">
                                                <SquarePen />
                                            </button>
                                            <button className={userStyles["btn-delete"]} title="Xóa">
                                                <Trash2 />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {users.length === 0 && (
                    <div className={userStyles["empty-state"]}>
                        <p>Không có người dùng nào trong hệ thống</p>
                    </div>
                )}
            </div>
        </div>
    );
}