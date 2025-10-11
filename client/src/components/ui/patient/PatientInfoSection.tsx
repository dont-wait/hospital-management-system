import { memo } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Label } from "@/components/ui/shared/Label";
import { Input } from "@/components/ui/shared/Input";
import { PatientUpdateDto } from "@/schemas/patient";

type PatientInfoSectionProps = {
  errors: FieldErrors<PatientUpdateDto>;
  register: UseFormRegister<PatientUpdateDto>;
};

function PatientInfoSection({ errors, register }: PatientInfoSectionProps) {
  return (
    <>
      <div className="space-y-4">
        {/* Họ và tên đệm */}
        <div className="space-y-2">
          <Label htmlFor="firstName">Họ và tên đệm *</Label>
          <Input
            id="firstName"
            type="text"
            placeholder="Nhập họ và tên đệm"
            {...register("firstName")}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.firstName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.firstName && (
            <p className="text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>

        {/* Tên */}
        <div className="space-y-2">
          <Label htmlFor="lastName">Tên *</Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Nhập tên"
            {...register("lastName")}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.lastName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.lastName && (
            <p className="text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            placeholder="Nhập email"
            {...register("email")}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Số điện thoại */}
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Số điện thoại *</Label>
          <Input
            id="phoneNumber"
            type="tel"
            placeholder="Nhập số điện thoại"
            {...register("phoneNumber")}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.phoneNumber ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.phoneNumber && (
            <p className="text-sm text-red-600">{errors.phoneNumber.message}</p>
          )}
        </div>
      </div>
    </>
  );
}

export default memo(PatientInfoSection);
