import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import Icon from "@/components/shared/Icon";
import { BillingService } from "@/services/server";
import { DateUtils, CurrencyUtils } from "@/lib/client";
import { BillingDetail as BillingDetailType, ApiResponse } from "@/types";

async function BillingDetail({
  params,
}: {
  params: Promise<{ billingId: string }>;
}) {
  const cookieStore = await cookies();
  const { billingId } = await params;
  const token = cookieStore.get("accessToken")?.value;
  let billingDetail: BillingDetailType;
  try {
    const response: ApiResponse<BillingDetailType> =
    await BillingService.getBillingDetail(parseInt(billingId), token);
    billingDetail = response.data;
  }
  catch {
    notFound();
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 mt-2 md:mt-4 lg:mt-12">
      <div className="lg:col-start-2 lg:col-span-2">
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-lg">
          {/* Header */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-martinique mb-2">
                  Chi Tiết Hóa Đơn
                </h2>
                <p className="text-sm text-gray-500">
                  Mã hóa đơn:{" "}
                  <span className="font-semibold text-east-bay">
                    #{billingDetail.id.toString().padStart(6, "0")}
                  </span>
                </p>
              </div>
              <Link
                href="/patient/appointment-management"
                style={{ display: "flex" }}
                className="items-center gap-2 px-4 py-2  text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="h-4 w-4">
                  <Icon name="ArrowLeft" className="w-4 h-4" />
                </div>
                Quay lại
              </Link>
            </div>
          </div>

          {/* BODY SECTIONS */}
          <div className="space-y-6">
            {/* Thông tin hóa đơn */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-martinique flex items-center gap-2">
                <Icon name="User" className="w-5 h-5 text-east-bay" />
                Thông tin hóa đơn
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Dịch vụ
                  </p>
                  <p className="text-sm text-gray-900 font-medium">
                    {billingDetail.serviceName}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Phương thức thanh toán
                  </p>
                  <p className="text-sm text-gray-900 font-medium">
                    {billingDetail.paymentMethod}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100"></div>

            {/* Thông tin thời gian */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-martinique flex items-center gap-2">
                <Icon name="Calendar" className="w-5 h-5 text-east-bay" />
                Thông tin thời gian
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Thời gian tạo
                  </p>
                  <p className="text-sm text-gray-900 font-medium">
                    {DateUtils.getDisplayDateTime(
                      billingDetail.createdAt,
                      "DayMonthYear",
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Giảm giá - Only show if discount exists */}
            {billingDetail.discountAmount > 0 && (
              <>
                <div className="border-t border-gray-100"></div>

                <div className="rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Icon
                          name="BadgePercent"
                          className="w-5 h-5 text-emerald-600"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-emerald-700 uppercase tracking-wide mb-0.5">
                          Giảm giá
                        </p>
                        <p className="text-lg font-bold text-emerald-600">
                          -
                          {CurrencyUtils.formatCurrency(
                            billingDetail.discountAmount,
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300">
                      <span className="text-xs font-semibold text-emerald-700">
                        Đã áp dụng
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="border-t border-gray-100"></div>

            {/* Thông tin thanh toán */}
            <div className="rounded-xl p-5 bg-gradient-to-br from-east-bay to-martinique text-white">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="text-white/70 text-xs font-medium mb-2">
                    Tổng thanh toán
                  </p>
                  <p className="text-3xl font-bold">
                    {CurrencyUtils.formatCurrency(billingDetail.paymentAmount)}
                  </p>
                </div>

                <div className="sm:text-right">
                  <p className="text-white/70 text-xs font-medium mb-2">
                    Trạng thái
                  </p>
                  <span
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${
                      billingDetail.billingStatus === "Paid"
                        ? "bg-emerald-400/20 text-emerald-100 border border-emerald-300/30"
                        : "bg-amber-400/20 text-amber-100 border border-amber-300/30"
                    }`}
                  >
                    {billingDetail.billingStatus === "UnPaid"
                      ? "Chưa thanh toán"
                      : "Đã thanh toán"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BillingDetail;
