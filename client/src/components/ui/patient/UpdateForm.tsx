import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, memo } from "react";
import { Button } from "@/components/ui/shared/Button";
import { Label } from "@/components/ui/shared/Label";
import { Input } from "@/components/ui/shared/Input";
import { LoadingSpinner } from "@/components/ui/shared/LoadingSpinner";
import { PatientUpdateDto, patientUpdateSchema } from "@/schemas/patient";
import AvatarSection from "./AvatarSection";
import AddressSection from "./AddressSection";
import GenderSection from "./GenderSection";
import DateSection from "./DateSection";

interface PatientUpdateFormProps {
  onSubmit: (patientDto: PatientUpdateDto) => Promise<void>;
  isLoading: boolean;
  initialData: Partial<PatientUpdateDto>;
}

function UpdateForm({
  onSubmit,
  isLoading,
  initialData,
}: PatientUpdateFormProps) {
  const defaultValues = useMemo(
    () => ({
      address: initialData.address || "",
      avatarUrl: initialData.avatarUrl || "",
      dateOfBirth: initialData.dateOfBirth || "",
      email: initialData.email || "",
      firstName: initialData.firstName || "",
      gender: initialData.gender || "",
      lastName: initialData.lastName || "",
      nationality: initialData.nationality || "",
      phoneNumber: initialData.phoneNumber || "",
      placeOfResidence: initialData.placeOfResidence || "",
    }),
    [initialData],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
  } = useForm<PatientUpdateDto>({
    resolver: zodResolver(patientUpdateSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Avatar */}
      <AvatarSection setValue={setValue} patient={initialData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
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
              <p className="text-sm text-red-600">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>
        </div>

        {/* Địa chỉ */}
        <div className="space-y-4">
          <AddressSection
            setValue={setValue}
            control={control}
            errors={errors}
            watch={watch}
            register={register}
            patient={initialData}
          />
        </div>
      </div>

      {/* Date */}
      <DateSection setValue={setValue} errors={errors} />

      {/* Gender */}
      <GenderSection control={control} errors={errors} />

      {/* Submit button */}
      <Button type="submit" className="w-full h-12" disabled={isLoading}>
        {isLoading ? (
          <LoadingSpinner text="Đang cập nhật..." />
        ) : (
          "Cập nhật thông tin"
        )}
      </Button>
    </form>
  );
}

export default memo(UpdateForm);
