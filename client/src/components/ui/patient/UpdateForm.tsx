import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useCallback, useMemo, memo } from "react";
import { Button } from "@/components/ui/shared/Button";
import { Label } from "@/components/ui/shared/Label";
import { Input } from "@/components/ui/shared/Input";
import { LoadingSpinner } from "@/components/ui/shared/LoadingSpinner";
import { PatientUpdateDto, patientUpdateSchema } from "@/schemas/patient";
import AvatarSection from "./AvatarSection";
import AddressSection from "./AddressSection";
import GenderSection from "./GenderSection";

interface PatientUpdateFormProps {
  onSubmit: (patientDto: PatientUpdateDto) => Promise<void>;
  isLoading: boolean;
  initialData: Partial<PatientUpdateDto>;
}

const months = [
  { value: "01", label: "Tháng 1" },
  { value: "02", label: "Tháng 2" },
  { value: "03", label: "Tháng 3" },
  { value: "04", label: "Tháng 4" },
  { value: "05", label: "Tháng 5" },
  { value: "06", label: "Tháng 6" },
  { value: "07", label: "Tháng 7" },
  { value: "08", label: "Tháng 8" },
  { value: "09", label: "Tháng 9" },
  { value: "10", label: "Tháng 10" },
  { value: "11", label: "Tháng 11" },
  { value: "12", label: "Tháng 12" },
];

function UpdateForm({
  onSubmit,
  isLoading,
  initialData,
}: PatientUpdateFormProps) {
  const [dateState, setDateState] = useState({
    day: "",
    month: "",
    year: "",
  });

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

  useEffect(() => {
    if (initialData?.dateOfBirth) {
      const date = new Date(initialData.dateOfBirth);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear().toString();

      setDateState({ day, month, year });
    }
  }, [initialData?.dateOfBirth]);

  useEffect(() => {
    const { day, month, year } = dateState;
    if (day && month && year) {
      const dateString = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      setValue("dateOfBirth", dateString, { shouldValidate: false });
    }
  }, [dateState, setValue]);

  const handleDayChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDateState((prev) => ({ ...prev, day: e.target.value }));
    },
    [],
  );

  const handleMonthChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setDateState((prev) => ({ ...prev, month: e.target.value }));
    },
    [],
  );

  const handleYearChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDateState((prev) => ({ ...prev, year: e.target.value }));
    },
    [],
  );

  // Memoize month options JSX
  const monthOptions = useMemo(
    () => (
      <>
        <option value="">Tháng</option>
        {months.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </>
    ),
    [],
  );

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

        {/* Cột phải - Địa chỉ */}
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

      {/* Ngày sinh */}
      <div className="space-y-2">
        <Label>Ngày sinh *</Label>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div>
            <Input
              type="number"
              placeholder="Ngày"
              value={dateState.day}
              onChange={handleDayChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              max="31"
            />
          </div>
          <div>
            <select
              value={dateState.month}
              onChange={handleMonthChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {monthOptions}
            </select>
          </div>
          <div>
            <Input
              type="number"
              placeholder="Năm"
              value={dateState.year}
              onChange={handleYearChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1900"
              max="2100"
            />
          </div>
        </div>
        {errors.dateOfBirth && (
          <p className="text-sm text-red-600">
            {errors.dateOfBirth.message as string}
          </p>
        )}
      </div>

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
