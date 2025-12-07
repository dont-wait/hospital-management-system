"use client";

import Link from "next/link";
import { useBookingExamContext, useUserAuthContext } from "@/contexts";
import { CurrencyUtils } from "@/lib/client";
import { Patient } from "@/types";

export default function CompletedBookingContent() {
  const { state, handleResetState, setStep } = useBookingExamContext();
  const { user } = useUserAuthContext();
  const patientId = (user as Patient)?.patientId ?? "";

  const handleResetContext = () => {
    setStep(1);
    handleResetState();
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Đặt khám thành công!
        </h1>
        <p className="text-gray-600">
          Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi
        </p>
      </div>

      {/* Patient Information */}
      {state.patient && (
        <div className="bg-white border rounded-lg p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-east-bay"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Thông tin bệnh nhân
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Họ và tên:</span>
              <p className="font-medium text-gray-800">
                {state.patient.firstName} {state.patient.lastName}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Số điện thoại:</span>
              <p className="font-medium text-gray-800">
                {state.patient.phoneNumber}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Email:</span>
              <p className="font-medium text-gray-800">{state.patient.email}</p>
            </div>
            <div>
              <span className="text-gray-600">Địa chỉ:</span>
              <p className="font-medium text-gray-800">
                {state.patient.address}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Records */}
      {state.records.length > 0 && (
        <div className="bg-white border rounded-lg p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-east-bay"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Danh sách lịch khám
          </h2>
          <div className="space-y-4">
            {state.records.map((record, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-2">
                      {record.departmentName}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span>Bác sĩ: {record.doctor.fullName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>{record.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>{record.slotTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                        <span>Phòng: {record.roomName}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-md font-semibold text-east-bay">
                      {CurrencyUtils.formatCurrency(record.price)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Total Payment */}
      {state.records.length > 0 && (
        <div className="bg-white border border-silver/50 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-800">
              Tổng chi phí:
            </span>
            <span className="text-lg font-bold text-east-bay">
              {CurrencyUtils.formatCurrency(
                state.records.reduce((sum, r) => sum + r.price, 0),
              )}
            </span>
          </div>
        </div>
      )}

      {/* Next Steps */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-amber-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          Các bước tiếp theo
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-amber-600 font-bold">1.</span>
            <span>
              Vui lòng đến bệnh viện trước giờ hẹn 15-30 phút để làm thủ tục
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600 font-bold">2.</span>
            <span>Thanh toán tại quầy lễ tân và nhận phiếu khám bệnh</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600 font-bold">3.</span>
            <span>Mang theo giấy tờ tùy thân và thẻ BHYT (nếu có)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600 font-bold">4.</span>
            <span>Thông tin chi tiết đã được gửi về email của bạn</span>
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href={`/patient/appointment-management/${patientId}`}
          className="flex-1 bg-east-bay text-white text-center font-semibold py-3 px-6 rounded-lg transition-colors shadow-md"
        >
          Xem lịch sử đặt khám
        </Link>

        <button
          onClick={handleResetContext}
          className="flex-1 bg-white hover:bg-gray-50 text-east-bay font-semibold py-3 px-6 rounded-lg border-2 border-east-bay transition-colors"
        >
          Đặt khám mới
        </button>
      </div>
    </div>
  );
}
