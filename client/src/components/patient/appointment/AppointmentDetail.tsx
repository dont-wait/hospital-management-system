"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Icon from "@/components/shared/Icon";
import { useAppointmentManagemnt } from "@/contexts";
import {
  DateUtils,
  PatientUtils,
  AppointmentUtils,
  CurrencyUtils,
} from "@/lib/client";
import { AppointmentService } from "@/services";
import { AppointmentDetail as AppointmentDetailType } from "@/types";

export default function AppointmentDetail({}) {
  const { appointmentId, setAppointmentId, deleteAppointment } =
    useAppointmentManagemnt();
  const [appointmentDetail, setAppointmentDetail] =
    useState<AppointmentDetailType | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    async function getAppointmentDetail() {
      if (!appointmentId) return;
      const response =
        await AppointmentService.getAppointmentDetail(appointmentId);
      if (response) {
        setAppointmentDetail(response.data);
      }
    }
    getAppointmentDetail();

    return () => {
      setAppointmentId(null);
    };
  }, [setAppointmentDetail, appointmentId, setAppointmentId]);

  if (!appointmentDetail) {
    return (
      <div className="bg-east- bay backdrop-blur-md rounded p-12 text-center border border-silver">
        <div className="w-16 h-16 mx-auto mb-4">
          <Icon name="ClipboardList" className="w-16 h-16 text-east-bay" />
        </div>
        <p className="text-east-bay">Chọn một cuộc hẹn để xem chi tiết</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white/80 backdrop-blur-xl rounded-xl p-8 border border-gray-200 shadow-md">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-east-bay tracking-tight mb-1">
              Chi Tiết Đăng Ký Khám
            </h2>
            <p className="text-sm text-gray-500">
              Mã cuộc hẹn: #
              {appointmentDetail.appointmentId.toString().padStart(6, "0")}
            </p>
          </div>

          {appointmentDetail.appointmentStatus !== "Cancelled" && (
            <button
              onClick={() => setShowCancelModal((prev) => !prev)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-colors duration-200"
            >
              Hủy Đăng Ký
            </button>
          )}
        </div>

        {/* BODY SECTIONS */}
        <div className="space-y-8">
          {/* Thông tin bệnh nhân */}
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-md">
            <h3 className="text-lg font-semibold text-east-bay mb-4 flex items-center gap-3">
              <div className="w-5 h-5">
                <Icon
                  name="User"
                  className="w-5 h-5 text-east-bay opacity-80"
                />
              </div>
              Thông Tin Bệnh Nhân
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-martinique font-bold text-md mb-1">
                  Họ và tên
                </p>
                <p className="text-gray-900">{appointmentDetail.fullName}</p>
              </div>
              <div>
                <p className="text-martinique font-bold text-md mb-1">
                  Ngày sinh
                </p>
                <p className="text-gray-900">
                  {DateUtils.getDisplayDateTime(
                    appointmentDetail.dateOfBirth,
                    "DayMonthYear",
                  )}
                </p>
              </div>
              <div>
                <p className="text-martinique font-bold text-md mb-1">
                  Giới tính
                </p>
                <p className="text-gray-900">
                  {PatientUtils.formatGender(appointmentDetail.gender)}
                </p>
              </div>
              <div>
                <p className="text-martinique font-bold text-md mb-1">
                  Chi tiết hóa đơn
                </p>
                <Link
                  href="#"
                  className="text-gray-900 hover:text-truev underline transition-colors"
                >
                  #{appointmentDetail.billingId.toString().padStart(6, "0")}
                </Link>
              </div>
            </div>
          </div>

          {/* Thông tin lịch hẹn */}
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-md">
            <h3 className="text-lg font-semibold text-east-bay mb-4 flex items-center gap-3">
              <div className="w-5 h-5">
                <Icon name="Calendar" className="w-5 h-5 opacity-80" />
              </div>
              Thông Tin Lịch Hẹn
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-martinique font-bold text-md mb-1">
                  Ngày khám
                </p>
                <p className="text-gray-900">
                  {DateUtils.getDisplayDateTime(
                    appointmentDetail.appointmentDate,
                    "DayMonthYear",
                  )}
                </p>
              </div>
              <div>
                <p className="text-martinique font-bold text-md mb-1">
                  Giờ khám
                </p>
                <p className="text-gray-900">
                  {AppointmentUtils.formatAppointmentTime(appointmentDetail)}
                </p>
              </div>
            </div>
          </div>

          {/* Thông tin phòng khám */}
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-md">
            <h3 className="text-lg font-semibold text-east-bay mb-4 flex items-center gap-3">
              <div className="w-5 h-5">
                <Icon name="Building2" className="w-5 h-5 opacity-80" />
              </div>
              Thông Tin Phòng Khám
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-martinique font-bold text-md mb-1">Khoa</p>
                <p className="text-gray-900">
                  {appointmentDetail.departmentName}
                </p>
              </div>
              <div>
                <p className="text-martinique font-bold text-md mb-1">
                  Phòng khám
                </p>
                <p className="text-gray-900">{appointmentDetail.roomName}</p>
              </div>
              <div>
                <p className="text-martinique font-bold text-md mb-1">Bác sĩ</p>
                <p className="text-gray-900">{appointmentDetail.doctorName}</p>
              </div>
            </div>
          </div>

          {/* Thông tin thanh toán */}
          <div className="rounded-xl p-5 bg-gradient-to-br from-east-bay/90 to-east-bay/70 text-white shadow-md">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-3">
              Thông Tin Thanh Toán
            </h3>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-white/90 text-sm mb-1">Chi phí khám</p>
                <p className="text-2xl font-semibold">
                  {CurrencyUtils.formatCurrency(
                    appointmentDetail.priceOfService,
                  )}
                </p>
              </div>

              <div className="text-right">
                <p className="text-white/90 text-sm mb-1">Trạng thái</p>
                <p
                  className={`text-lg font-semibold ${
                    appointmentDetail.appointmentStatus === "Paid"
                      ? "text-green-300"
                      : appointmentDetail.appointmentStatus === "Cancelled"
                        ? "text-red-300"
                        : "text-yellow-300"
                  }`}
                >
                  {appointmentDetail.appointmentStatus === "Unpaid"
                    ? "Chưa thanh toán"
                    : appointmentDetail.appointmentStatus === "Paid"
                      ? "Đã thanh toán"
                      : "Đã hủy"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Xác Nhận Hủy Đăng Ký
              </h3>
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed">
              Bạn có chắc chắn muốn hủy đăng ký khám này? Hành động này không
              thể hoàn tác.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
              >
                Không
              </button>
              <button
                onClick={() => {
                  deleteAppointment(appointmentDetail.appointmentId);
                }}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Xác Nhận Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
