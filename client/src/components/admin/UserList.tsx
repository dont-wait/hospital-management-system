"use client";

import { AuthUserWithoutTokens, roles, Role } from "@/types";
import styles from "@/styles/admin.module.css";
import userStyles from "@/styles/admin-user-management.module.css";
import { Eye, SquarePen, Trash2, ChevronDown, Search } from "lucide-react";
import { useReducer, useRef, useEffect, useMemo } from "react";
import { getUserRole, getUserName, getUserEmail, getUserPhone, roleIdToName } from "@/lib/helper";
import { UserDetail } from "./UserDetail";
import { EmployeeUpdateModal } from "@/components/Employee";

interface UserListProps { 
    users: AuthUserWithoutTokens[];
}

const visibleRoles = roles.filter(
(r): r is Exclude<Role, "admin" | "guest"> => r !== "admin" && r !== "guest"
);

type ModalType = "view" | "update" | null;

interface UserListState {
    isDropdownOpen: boolean;
    selectedRole: Exclude<Role, "admin" | "guest">;
    searchTerm: string;
    selectedUser: AuthUserWithoutTokens | null;
    activeModal: ModalType;
}

type UserListAction =
    | { type: "TOGGLE_DROPDOWN" }
    | { type: "CLOSE_DROPDOWN" }
    | { type: "SET_ROLE"; payload: Exclude<Role, "admin" | "guest"> }
    | { type: "SET_SEARCH"; payload: string }
    | { type: "OPEN_VIEW_MODAL"; payload: AuthUserWithoutTokens }
    | { type: "OPEN_UPDATE_MODAL"; payload: AuthUserWithoutTokens }
    | { type: "CLOSE_MODAL" };

const initialState: UserListState = {
    isDropdownOpen: false,
    selectedRole: "doctor",
    searchTerm: "",
    selectedUser: null,
    activeModal: null,
};

const userListReducer = (state: UserListState, action: UserListAction): UserListState => {
    switch (action.type) {
        case "TOGGLE_DROPDOWN":
            return { ...state, isDropdownOpen: !state.isDropdownOpen };
        case "CLOSE_DROPDOWN":
            return { ...state, isDropdownOpen: false };
        case "SET_ROLE":
            return { ...state, selectedRole: action.payload, isDropdownOpen: false };
        case "SET_SEARCH":
            return { ...state, searchTerm: action.payload };
        case "OPEN_VIEW_MODAL":
            return { ...state, selectedUser: action.payload, activeModal: "view" };
        case "OPEN_UPDATE_MODAL":
            return { ...state, selectedUser: action.payload, activeModal: "update" };
        case "CLOSE_MODAL":
            return { ...state, activeModal: null };
        default:
            return state;
    }
}

export function UserList({ users }: UserListProps) {
    const [state, dispatch] = useReducer(userListReducer, initialState);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Đóng dropdown khi click bên ngoài
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                dispatch({ type: "CLOSE_DROPDOWN" });
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const name = getUserName(user).toLowerCase();
            const email = getUserEmail(user).toLowerCase();
            const phone = getUserPhone(user);
            const citizenID = user.citizenID.toLowerCase();
            const search = state.searchTerm.toLowerCase();

            return (
                name.includes(search) ||
                email.includes(search) ||
                phone.includes(search) ||
                citizenID.includes(search)
            );
        });
    }, [users, state.searchTerm]);

    const handleViewUser = (user: AuthUserWithoutTokens) => {
        dispatch({ type: "OPEN_VIEW_MODAL", payload: user });
    };

    const handleUpdateUser = (user: AuthUserWithoutTokens) => {
        dispatch({ type: "OPEN_UPDATE_MODAL", payload: user });
    };

    const handleUpdateSuccess = (updatedEmployee: AuthUserWithoutTokens) => {
        // TODO: Cập nhật lại danh sách users sau khi update thành công
        console.log("Employee updated:", updatedEmployee);
        // Có thể trigger refetch data ở đây
        dispatch({ type: "CLOSE_MODAL" });
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
                                    value={state.searchTerm}
                                    onChange={(e) => dispatch({ type: "SET_SEARCH", payload: e.target.value })}
                                    className={userStyles["search-input"]}
                                />
                            </div>
                            
                            <div className={userStyles["dropdown-container"]} ref={dropdownRef}>
                                <button 
                                    onClick={() => dispatch({ type: "TOGGLE_DROPDOWN" })}
                                    className={userStyles["dropdown-btn"]}
                                    type="button"
                                >
                                    {roleIdToName[state.selectedRole] || state.selectedRole}
                                    <ChevronDown className={`${userStyles["dropdown-icon"]} ${state.isDropdownOpen ? userStyles["dropdown-icon-open"] : ''}`} />
                                </button>
                                
                                {state.isDropdownOpen && (
                                    <div className={userStyles["dropdown-menu"]}>
                                        <ul>
                                            {
                                                visibleRoles.map((role => (
                                                    <li key={role}>
                                                        <button 
                                                            onClick={() => dispatch({ type: "SET_ROLE", payload: role })}
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
                                                <button 
                                                    className={userStyles["btn-edit"]} 
                                                    title="Chỉnh sửa"
                                                    onClick={() => handleUpdateUser(user)}
                                                >
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
                                {state.searchTerm 
                                    ? `Không tìm thấy người dùng nào với từ khóa "${state.searchTerm}"`
                                    : "Không có người dùng nào trong hệ thống"
                                }
                            </p>
                        </div>
                    )}
                </div>
            </div>
            {state.selectedUser && (
                <UserDetail
                    user={state.selectedUser}
                    isOpen={state.activeModal === "view"}
                    setIsOpen={(isOpen) => !isOpen && dispatch({ type: "CLOSE_MODAL" })}
                />
            )}
            {state.selectedUser && state.selectedUser.employee && (
                <EmployeeUpdateModal
                    isOpen={state.activeModal === "update"}
                    setIsOpen={(isOpen) => !isOpen && dispatch({ type: "CLOSE_MODAL" })}
                    employee={state.selectedUser}
                    isAdmin={true}
                    onSuccess={handleUpdateSuccess}
                />
            )}
        </>
    );
}