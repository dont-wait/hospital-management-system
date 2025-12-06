"use client";

import bannerImage from "@/public/images/banner-mask.svg";

function Banner() {
  return (
    <div
      className="bg-cover bg-center flex h-100 md:h-screen"
      style={{
        backgroundImage: `url(${bannerImage.src})`,
      }}
    >
      <div className="m-auto flex flex-col items-center justify-center gap-3 md:gap-6">
        <h1
          className="text-white font-bold text-2xl md:text-4xl lg:text-5xl"
          style={{
            filter: "drop-shadow(0 0 3px rgba(255, 255, 255, 0.5)",
          }}
        >
          Chào mừng đến với Bệnh viện MediCare
        </h1>
        <p
          className="text-white text-center font-normal text-sm md:text-xl w-100 md:w-2xl"
          style={{
            filter: "drop-shadow(0 0 3px rgba(255, 255, 255, 0.5)",
          }}
        >
          Sức khỏe của bạn là ưu tiên hàng đầu của chúng tôi. Trải nghiệm dịch
          vụ chăm sóc y tế đẳng cấp thế giới với đội ngũ chuyên gia tận tâm, cơ
          sở vật chất hiện đại và các dịch vụ chăm sóc sức khỏe toàn diện.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button className="bg-martinique font-medium text-sm md:text-md text-mauve rounded-md px-4 md:px-10 py-2">
            Bắt đầu ngay
          </button>

          <button className="bg-white font-medium text-sm md:text-md text-martinique rounded-md px-4 md:px-10 py-2">
            Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
}

export default Banner;
