"use client";

import { useBookingExamContext } from "@/contexts";
import Icon from "@/components/shared/Icon";
import BookingItem from "./BookingItem";
import InfoItem from "./InfoItem";
import { PatientUtils, CurrencyUtils, DateUtils } from "@/lib/client";

export default function ConfirmContent() {
  const { state, removeBookingRecord } = useBookingExamContext();
  return (
    <>
      <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm mb-2">
        <h3 className="text-xl font-semibold text-martinique mb-5">
          Thông tin bệnh nhân
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InfoItem
            label="Họ và tên"
            value={`${state.patient!.firstName} ${state.patient!.lastName}`}
          />
          <InfoItem
            label="Ngày sinh"
            value={DateUtils.getDisplayDateTime(state.patient!.dateOfBirth, "DayMonthYear")}
          />
          <InfoItem
            label="Giới tính"
            value={PatientUtils.formatGender(state.patient!.gender)}
          />
          <InfoItem label="Số điện thoại" value={state.patient!.phoneNumber} />

          <div className="md:col-span-2">
            <InfoItem label="Địa chỉ" value={state.patient!.address} />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {state.records.map((record, index) => (
          <div
            key={index}
            className="relative border border-gray-200 rounded-xl p-4 bg-white shadow-sm"
          >
            <button
              onClick={() => {
                removeBookingRecord(record.departmentName);
              }}
              className="absolute top-3 right-3 p-2 rounded-full hover:bg-red-100 transition"
            >
              <Icon name="Trash" className="w-5 h-5 text-red-500" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <BookingItem
                iconBg="bg-east-bay"
                icon="User"
                iconColor="text-white"
                label="Bác sĩ"
                value={record.doctor.fullName}
              />

              <BookingItem
                iconBg="bg-east-bay"
                icon="Stethoscope"
                iconColor="text-white"
                label="Chuyên khoa"
                value={record.departmentName}
              />

              <BookingItem
                iconBg="bg-east-bay"
                icon="Calendar"
                iconColor="text-white"
                label="Ngày & Giờ khám"
                value={`${record.date} - ${record.slotTime}`}
              />

              <BookingItem
                iconBg="bg-east-bay"
                icon="MapPin"
                iconColor="text-white"
                label="Địa điểm"
                value={record.roomName}
              />
            </div>

            <div className="pt-4 border-t">
              <p className="text-martinique font-semibold text-lg">
                Giá: {CurrencyUtils.formatCurrency(record.price)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
