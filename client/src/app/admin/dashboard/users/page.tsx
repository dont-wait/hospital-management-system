import { UserList } from "@/components/admin/UserList";
import { DoctorService } from "@/services/doctor.service";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quản lý người dùng | Medica Hospital",
    description: "Quản lý tất cả người dùng trong hệ thống bệnh viện",
};

async function UsersManagementPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
        redirect("/login");
    }
    
    try {
        const getAllDoctors = await DoctorService.getAllDoctors(token);
        return <UserList users={getAllDoctors} />;
    } catch (error) {
        console.error("Error fetching doctors:", error);
        return <UserList users={[]} />;
    }
}

export default UsersManagementPage;