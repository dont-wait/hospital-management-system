import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import Icon from "@/components/shared/Icon";
import AppointmentDetail from "@/components/patient/appointment/AppointmentDetail";
import AppointmentList from "@/components/patient/appointment/AppointmentList";
import { AppointmentService } from "@/services/server";
import { ApiResponseWithPaging, Appointment } from "@/types";

interface AppointmentManagementProps {
  params: Promise<{ slug: string[] }>;
}

export default async function AppointmentManagementPage({
  params,
}: AppointmentManagementProps) {
  const { slug } = await params;
  if (!slug) {
    notFound();
  }

  const cookieStore = await cookies();
  const [patientId, billingId] = slug;
  const token = cookieStore.get("accessToken")?.value;
  const response: ApiResponseWithPaging<Appointment[]> =
    await AppointmentService.getAppointments(patientId, token);
  const totalPages = response.totalPages;
  const appointments: Appointment[] = response.data;

  if (patientId && !billingId) {
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-3xl md:text-4xl text-east-bay mb-2 flex items-center gap-3">
            <Icon name="ClipboardList" className="w-8 h-8 text-east-bay" />
            Quản lý thông tin đăng ký khám
          </h1>
          <p className="text-east-bay">
            Quản lý và theo dõi các cuộc hẹn khám bệnh của bạn
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Appointments List */}
          <div className="lg:col-span-1">
            <AppointmentList
              appointments={appointments}
              totalPages={totalPages}
            />
          </div>

          {/* Appointment Detail */}
          <div className="lg:col-span-2">
            <AppointmentDetail />
          </div>
        </div>
      </div>
    </div>
  );
}
