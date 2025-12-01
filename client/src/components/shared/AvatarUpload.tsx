"use client";

import { useState, useRef, useCallback, ChangeEvent } from "react";
import Image from "next/image";
import { Button } from "@/components";
import authStyles from "@/styles/auth.module.css";
import avatarStyles from "@/styles/avatar.module.css";

type AvatarUploadProps = {
  initialUrl?: string;
  onAvatarChange: (avatarUrl: string) => void;
  size?: number;
  buttonText?: string;
  showPreview?: boolean;
};

export function AvatarUpload({
  initialUrl = "",
  onAvatarChange,
  size = 96,
  buttonText = "Thay đổi ảnh",
  showPreview = true,
}: AvatarUploadProps) {
  const [avatarPreview, setAvatarPreview] = useState<string>(initialUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          setAvatarPreview(result);
          onAvatarChange(result);
        };
        reader.readAsDataURL(file);
      }
    },
    [onAvatarChange],
  );

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className={authStyles["form-group"]}>
      <div className={avatarStyles["avatar-upload"]}>
        {showPreview && (
          <div
            className={avatarStyles["avatar-image-frame"]}
            style={{ width: size, height: size }}
          >
            {avatarPreview && (
              <Image
                src={avatarPreview}
                width={size}
                height={size}
                alt="Avatar"
                className={avatarStyles["avatar-image"]}
                priority
              />
            )}
          </div>
        )}
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            accept="image/*"
            className="hidden"
          />
          <Button type="button" variant="outline" onClick={handleButtonClick}>
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
}
