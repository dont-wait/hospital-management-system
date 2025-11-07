import { AuthUserWithoutTokens, Gender } from "@/types";
import styles from "@/styles/admin.module.css";
import userStyles from "@/styles/admin-user-management.module.css";

function UsersManagementPage() {
    const mockdata: AuthUserWithoutTokens[] = [
        {
            userAccountId: "USR001",
            citizenID: "079012345678",
            avatarUrl: "https://ui-avatars.com/api/?name=Nguyen+Van+A&background=3b82f6&color=fff",
            is_Active: true,
            patient: {
                patientId: "PT001",
                firstName: "An",
                lastName: "Nguyễn Văn",
                email: "nguyenvanan@email.com",
                phoneNumber: "0901234567",
                dateOfBirth: "1990-05-15",
                gender: Gender.Male,
                nationality: "Việt Nam",
                address: "123 Đường Lê Lợi, Quận 1",
                placeOfResidence: "Hồ Chí Minh",
                avatarUrl: "https://ui-avatars.com/api/?name=Nguyen+Van+A&background=3b82f6&color=fff"
            },
            employee: null
        },
        {
            userAccountId: "USR002",
            citizenID: "079087654321",
            avatarUrl: "https://ui-avatars.com/api/?name=Tran+Thi+B&background=ec4899&color=fff",
            is_Active: true,
            patient: null,
            employee: {
                employeeId: "EMP001",
                firstName: "Bình",
                lastName: "Trần Thị",
                dateOfBirth: "1985-08-20",
                gender: "F",
                phoneNumber: "0912345678",
                email: "tranthibinh@hospital.com",
                hireDate: "2015-03-10",
                certificateNumber: "BS12345",
                specialization: "Tim mạch",
                avatarUrl: "https://ui-avatars.com/api/?name=Tran+Thi+B&background=ec4899&color=fff",
                roleId: "doctor"
            }
        },
        {
            userAccountId: "USR003",
            citizenID: "079098765432",
            avatarUrl: "https://ui-avatars.com/api/?name=Le+Van+C&background=10b981&color=fff",
            is_Active: false,
            patient: {
                patientId: "PT002",
                firstName: "Cường",
                lastName: "Lê Văn",
                email: "levancuong@email.com",
                phoneNumber: "0923456789",
                dateOfBirth: "1995-12-03",
                gender: Gender.Male,
                nationality: "Việt Nam",
                address: "456 Đường Nguyễn Huệ, Quận 3",
                placeOfResidence: "Hồ Chí Minh",
                avatarUrl: "https://ui-avatars.com/api/?name=Le+Van+C&background=10b981&color=fff"
            },
            employee: null
        },
        {
            userAccountId: "USR004",
            citizenID: "079011223344",
            avatarUrl: "https://ui-avatars.com/api/?name=Pham+Thi+D&background=f59e0b&color=fff",
            is_Active: true,
            patient: null,
            employee: {
                employeeId: "EMP002",
                firstName: "Dung",
                lastName: "Phạm Thị",
                dateOfBirth: "1988-06-15",
                gender: "F",
                phoneNumber: "0934567890",
                email: "phamthidung@hospital.com",
                hireDate: "2018-07-20",
                certificateNumber: "BS67890",
                specialization: "Nhi khoa",
                avatarUrl: "https://ui-avatars.com/api/?name=Pham+Thi+D&background=f59e0b&color=fff",
                roleId: "doctor"
            }
        },
        {
            userAccountId: "USR005",
            citizenID: "079055667788",
            avatarUrl: "https://ui-avatars.com/api/?name=Hoang+Van+E&background=8b5cf6&color=fff",
            is_Active: true,
            patient: {
                patientId: "PT003",
                firstName: "Em",
                lastName: "Hoàng Văn",
                email: "hoangvanem@email.com",
                phoneNumber: "0945678901",
                dateOfBirth: "2000-01-25",
                gender: Gender.Male,
                nationality: "Việt Nam",
                address: "789 Đường Trần Hưng Đạo, Quận 5",
                placeOfResidence: "Hồ Chí Minh",
                avatarUrl: "https://ui-avatars.com/api/?name=Hoang+Van+E&background=8b5cf6&color=fff"
            },
            employee: null
        }
    ];

    const getUserRole = (user: AuthUserWithoutTokens): string => {
        const roleIdToName: Record<string, string> = {
            admin: "Quản trị viên",
            doctor: "Bác sĩ",
            patient: "Bệnh nhân",
        };

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
                    <button className={userStyles["add-user-btn"]}>
                        <span>+</span> Thêm người dùng
                    </button>
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
                            {mockdata.map((user) => (
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
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </button>
                                            <button className={userStyles["btn-edit"]} title="Chỉnh sửa">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                </svg>
                                            </button>
                                            <button className={userStyles["btn-delete"]} title="Xóa">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {mockdata.length === 0 && (
                    <div className={userStyles["empty-state"]}>
                        <p>Không có người dùng nào trong hệ thống</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UsersManagementPage;