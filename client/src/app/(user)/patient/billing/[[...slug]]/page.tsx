import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import Icon from "@/components/shared/Icon";
import BillingList from "@/components/patient/billing/BillingList";
import BillingDetail from "@/components/patient/billing/BillingDetail";
import BillingDetailContainer from "@/components/patient/billing/BillingDetailContainer";
import { BillingService } from "@/services/server";
import { ApiResponseWithPaging, Billing } from "@/types";

interface BillingPageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function BillingPage({ params }: BillingPageProps) {
  const { slug } = await params;
  if (!slug) {
    notFound();
  }
  const cookieStore = await cookies();
  const [patientId, billingId] = slug;
  const token = cookieStore.get("accessToken")?.value;
  const response: ApiResponseWithPaging<Billing[]> =
    await BillingService.getBillings(patientId, token);
  const totalPages = response.totalPages;
  const billings: Billing[] = response.data;

  if (patientId && !billingId) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-4">
            <h1 className="text-xl md:text-4xl text-east-bay mb-2 flex items-center gap-3">
              <Icon name="ClipboardList" className="w-8 h-8 text-east-bay" />
              Quản lý thông tin hóa đơn{" "}
            </h1>
            <p className="text-east-bay">
              Quản lý và theo dõi các hóa đơn khám bệnh của bạn
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Appointments List */}
            <div className="lg:col-span-1">
              <BillingList billings={billings} totalPages={totalPages} />
            </div>

            {/* Appointment Detail */}
            <div className="lg:col-span-2">
              <BillingDetail />
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (patientId && billingId) {
    return (
      <BillingDetailContainer patientId={patientId} billingId={billingId} />
    );
  } else {
    notFound();
  }
}
