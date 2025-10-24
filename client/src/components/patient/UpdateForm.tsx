import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, memo } from "react";
import { useRouter } from "next/navigation";
import {
  SubmitButton,
  FormField,
  AddressField,
  RadioGroupField,
  DateField,
  AvatarField,
} from "@/components";
import { PatientUpdateDto, patientUpdateSchema } from "@/schemas";
import { Patient } from "@/types";
import { GENDER_OPTIONS } from "@/config";
import { useUserAuthContext } from "@/contexts";
import { PatientService, TokenService } from "@/services";
import authStyles from "@/styles/auth.module.css";
import patientStyles from "@/styles/patient.module.css";

function UpdateForm() {
  const router = useRouter();
  const { user, setUser } = useUserAuthContext();
  const patient = user as Patient;
  const defaultValues = useMemo(
    () => ({
      address: patient?.address || "",
      avatarUrl: patient?.avatarUrl || "",
      dateOfBirth: patient?.dateOfBirth || "",
      email: patient?.email || "",
      firstName: patient?.firstName || "",
      gender: patient?.gender || "",
      lastName: patient?.lastName || "",
      nationality: patient?.nationality || "",
      phoneNumber: patient?.phoneNumber || "",
      placeOfResidence: patient?.placeOfResidence || "",
    }),
    [patient],
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    setValue,
  } = useForm<PatientUpdateDto>({
    resolver: zodResolver(patientUpdateSchema),
    defaultValues,
  });

  const handleFormSubmit = async (patientUpdateDto: PatientUpdateDto) => {
    const patientId = patient.patientId;
    const updateUser = await PatientService.updatePatient(
      patientId,
      patientUpdateDto,
    );
    if (updateUser && "patientId" in updateUser) {
      setUser({
        ...user,
        ...updateUser,
      } as Patient);

      TokenService.saveUser<Patient>({
        ...user,
        ...updateUser,
      } as Patient);
      router.push("/patient");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className={patientStyles["patient-content"]}
    >
      <AvatarField
        initialUrl={patient?.avatarUrl}
        onAvatarChange={(url) => {
          setValue("avatarUrl", url);
        }}
      />

      <div className={patientStyles["info-section"]}>
        <div className={patientStyles["patient-content"]}>
          <FormField
            id="firstName"
            label="Họ và tên đệm"
            placeholder="Nhập họ và tên đệm"
            errors={errors}
            register={register}
          />

          <FormField
            id="lastName"
            label="Tên"
            placeholder="Nhập tên"
            errors={errors}
            register={register}
          />

          <FormField
            id="email"
            type="email"
            label="Email"
            placeholder="Nhập email"
            errors={errors}
            register={register}
          />

          <FormField
            id="phoneNumber"
            label="Số điện thoại"
            placeholder="Nhập số điện thoại"
            errors={errors}
            register={register}
          />
        </div>

        <div className={patientStyles["patient-content"]}>
          <AddressField
            setValue={setValue}
            errors={errors}
            control={control}
            patient={patient}
          />

          <FormField
            id="address"
            label="Địa chỉ thường trú"
            placeholder="Nhập địa chỉ thường trú"
            type="textarea"
            rows={5}
            register={register}
            errors={errors}
          />
        </div>
      </div>

      <DateField<PatientUpdateDto>
        name="dateOfBirth"
        setValue={setValue}
        errors={errors}
        defaultValue={patient?.dateOfBirth}
      />

      <RadioGroupField
        name="gender"
        control={control}
        errors={errors}
        options={[...GENDER_OPTIONS]}
      />

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
