import { UserList } from "@/components/admin/UserList";
import { EmployeeService } from "@/services/employee.service";
import { cookies } from "next/headers";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quản lý người dùng | Medicare Hospital",
    description: "Quản lý tất cả người dùng trong hệ thống bệnh viện",
};

async function UsersManagementPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    
    try {
        const getAllEmployees = await EmployeeService.getAllEmployeesByRole("doctor", token);
        return <UserList users={getAllEmployees} />;
    } catch (error) {
        return <UserList users={[]} />;
    }
}

export default UsersManagementPage;