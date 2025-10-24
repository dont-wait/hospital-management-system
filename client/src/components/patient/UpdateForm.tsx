import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, memo, lazy } from "react";
import { SubmitButton } from "@/components";
import { PatientUpdateDto, patientUpdateSchema } from "@/schemas";
import { Patient } from "@/types";
import authStyles from "@/styles/auth.module.css";

const AvatarSection = lazy(() => import("@/components/patient/AvatarSection"));

const AddressSection = lazy(
  () => import("@/components/patient/AddressSection"),
);

const GenderSection = lazy(() => import("@/components/patient/GenderSection"));

const DateSection = lazy(() => import("@/components/patient/DateSection"));

const PatientInfoSection = lazy(
  () => import("@/components/patient/PatientInfoSection"),
);

interface PatientUpdateFormProps {
  onSubmit: (id: string, patientDto: PatientUpdateDto) => Promise<boolean>;
  initialData: Partial<PatientUpdateDto>;
}

function UpdateForm({ onSubmit, initialData }: PatientUpdateFormProps) {
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
    formState: { errors, isSubmitting },
    control,
    setValue,
    watch,
  } = useForm<PatientUpdateDto>({
    resolver: zodResolver(patientUpdateSchema),
    defaultValues,
  });

  const handleFormSubmit = async (data: PatientUpdateDto) => {
    const patientId = (initialData as Patient).patientId;
    await onSubmit(patientId, data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Avatar */}
      <AvatarSection setValue={setValue} patient={initialData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Patient Info*/}
        <PatientInfoSection errors={errors} register={register} />

        {/* Address */}
        <AddressSection
          setValue={setValue}
          control={control}
          errors={errors}
          watch={watch}
          register={register}
          patient={initialData}
        />
      </div>

      {/* Date */}
      <DateSection
        setValue={setValue}
        errors={errors}
        defaultValue={defaultValues.dateOfBirth}
      />

      {/* Gender */}
      <GenderSection control={control} errors={errors} />

      {/* Submit button */}
      <SubmitButton
        isSubmitting={isSubmitting}
        className={authStyles["submit-btn"]}
        label="Cập nhật thông tin"
        submittingLabel="Đang cập nhật..."
      />
    </form>
  );
}

export default memo(UpdateForm);
