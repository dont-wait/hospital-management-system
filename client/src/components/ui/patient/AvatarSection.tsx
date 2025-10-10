import Image from "next/image";
import { UseFormSetValue } from "react-hook-form";
import { useState, useRef, ChangeEvent, useCallback, memo } from "react";
import { Button } from "@/components/ui/shared/Button";
import { PatientUpdateDto } from "@/schemas/patient";

type AvatarSectionProps = {
  setValue: UseFormSetValue<PatientUpdateDto>;
  patient: Partial<PatientUpdateDto>;
}

function AvatarSection({ setValue, patient }: AvatarSectionProps) {
  const [avatarPreview, setAvatarPreview] = useState<string>(
    patient.avatarUrl || "",
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarPreview(result);
        setValue("avatarUrl", result);
      };
      reader.readAsDataURL(file);
    }
  }, [setValue]);

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        <div
          className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 
          flex items-center justify-center border border-gray-500"
        >
          {avatarPreview && (
            <Image
              src={avatarPreview}
              width={100}
              height={100}
              alt="Avatar"
              className="w-full h-full object-cover"
              priority
            />
          )}
        </div>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            accept="image/*"
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleButtonClick}
          >
            Thay đổi ảnh
          </Button>
        </div>
      </div>
    </div>
  );
}

export default memo(AvatarSection);
