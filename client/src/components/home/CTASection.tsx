"use client";

import { useRouter } from "next/navigation";
import Icon from "@/components/shared/Icon";

export default function CTASection() {
  const router = useRouter();
  return (
    <div className="py-6 md:py-14 px-4 bg-martinique flex flex-col items-center justify-center gap-4">
      <h2 className="text-white font-bold text-xl md:text-2xl lg:text-3xl text-center">
        Sẵn sàng trải nghiệm dịch vụ chăm sóc sức khỏe chất lượng?
      </h2>
      <p className="text-white text-sm lg:text-xl text-center">
        Tham gia cùng hàng nghìn bệnh nhân tin tưởng Bệnh viện MediCare cho nhu
        cầu chăm sóc sức khỏe của họ.
      </p>
      <button
        onClick={() => {
          router.push("/register");
        }}
        className="py-2 px-4 rounded-md bg-mauve text-martinique font-semibold flex justify-center items-center gap-4"
      >
        Đăng ký ngay hôm nay
        <div className="w-4 h-4 flex items-center justify-center">
          <Icon name="ArrowRight" className="w-4 h-4" />
        </div>
      </button>
    </div>
  );
}
