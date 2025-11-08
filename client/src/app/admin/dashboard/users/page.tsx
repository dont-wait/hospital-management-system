"use client";
import { UserList } from "@/components/admin/UserList";
import { AuthUserWithoutTokens, Gender } from "@/types";

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
    
    return (
        <UserList users={mockdata} />
    );
}

export default UsersManagementPage;