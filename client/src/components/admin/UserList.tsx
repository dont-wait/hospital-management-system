"use client";

import { AuthUserWithoutTokens, roles, Role } from "@/types";
import styles from "@/styles/admin.module.css";
import userStyles from "@/styles/admin-user-management.module.css";
import { Eye, SquarePen, Trash2, ChevronDown, Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { getUserRole, getUserName, getUserEmail, getUserPhone, roleIdToName } from "@/lib/helper";
import { UserDetail } from "./UserDetail";

interface UserListProps { 
    users: AuthUserWithoutTokens[];
}

const visibleRoles = roles.filter(
(r): r is Exclude<Role, "admin" | "guest"> => r !== "admin" && r !== "guest"
);

export function UserList({ users }: UserListProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [selectedRole, setSelectedRole] = useState<Exclude<Role, "admin" | "guest">>("doctor");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState<AuthUserWithoutTokens | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const filteredUsers = users.filter((user) => {
        const name = getUserName(user).toLowerCase();
        const email = getUserEmail(user).toLowerCase();
        const phone = getUserPhone(user);
        const citizenID = user.citizenID.toLowerCase();
        const search = searchTerm.toLowerCase();

        return (
            name.includes(search) ||
            email.includes(search) ||
            phone.includes(search) ||
            citizenID.includes(search)
        );
    });

    const handleViewUser = (user: AuthUserWithoutTokens) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    return (
        <>
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
                            <div className={userStyles["search-container"]}>
                                <Search className={userStyles["search-icon"]} />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm theo tên, email, SĐT, CCCD..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={userStyles["search-input"]}
                                />
                            </div>
                            
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
                                {filteredUsers.map((user) => (
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
                                                <button 
                                                    onClick={() => handleViewUser(user)} 
                                                    className={userStyles["btn-view"]} 
                                                    title="Xem chi tiết"
                                                >
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

                    {filteredUsers.length === 0 && (
                        <div className={userStyles["empty-state"]}>
                            <p>
                                {searchTerm 
                                    ? `Không tìm thấy người dùng nào với từ khóa "${searchTerm}"`
                                    : "Không có người dùng nào trong hệ thống"
                                }
                            </p>
                        </div>
                    )}
                </div>
            </div>
            {selectedUser && (
                <UserDetail
                    user={selectedUser}
                    isOpen={isModalOpen}
                    setIsOpen={setIsModalOpen}
                />
            )}
        </>
    );
}