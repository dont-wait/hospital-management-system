import { IconNames } from "@/types";

interface HomeFeature {
  icon: IconNames;
  title: string;
  description: string;
}

export const features: HomeFeature[] = [
  {
    icon: "Shield",
    title: "Chăm sóc chuyên nghiệp",
    description:
      "Đội ngũ bác sĩ và chuyên gia giàu kinh nghiệm cung cấp dịch vụ chăm sóc y tế chất lượng cao nhất.",
  },
  {
    icon: "Clock",
    title: "Cấp cứu 24/7",
    description:
      "Dịch vụ cấp cứu suốt ngày đêm đảm bảo bạn được hỗ trợ khi cần thiết nhất.",
  },
  {
    icon: "Users",
    title: "Chăm sóc toàn diện",
    description:
      "Từ chăm sóc dự phòng đến điều trị chuyên khoa, chúng tôi cung cấp đầy đủ các dịch vụ y tế.",
  },
  {
    icon: "Star",
    title: "Hài lòng bệnh nhân",
    description:
      "Liên tục được bệnh nhân đánh giá 5 sao cho dịch vụ chăm sóc và phục vụ tuyệt vời.",
  },
];

type HomeService = Omit<HomeFeature, "icon">;

export const services: HomeService[] = [
  {
    title: "Thần kinh",
    description:
      "Chăm sóc và điều trị chuyên khoa thần kinh với thiết bị hiện đại nhất.",
  },
  {
    title: "Chấn thương chỉnh hình",
    description:
      "Chăm sóc và điều trị chuyên khoa chấn thương chỉnh hình với thiết bị hiện đại nhất.",
  },
  {
    title: "Tim mạch",
    description:
      "Chăm sóc và điều trị chuyên khoa tim mạch với thiết bị hiện đại nhất.",
  },
  {
    title: "Ung bướu",
    description:
      "Chăm sóc và điều trị chuyên khoa ung bướu với thiết bị hiện đại nhất.",
  },
  {
    title: "Nhi khoa",
    description:
      "Chăm sóc và điều trị chuyên khoa nhi khoa với thiết bị hiện đại nhất.",
  },
  {
    title: "Y học cấp cứu",
    description:
      "Chăm sóc và điều trị chuyên khoa y học cấp cứu với thiết bị hiện đại nhất.",
  },
  {
    title: "Phẫu thuật",
    description:
      "Chăm sóc và điều trị chuyên khoa phẫu thuật với thiết bị hiện đại nhất.",
  },
  {
    title: "Chẩn đoán hình ảnh",
    description:
      "Chăm sóc và điều trị chuyên khoa chẩn đoán hình ảnh với thiết bị hiện đại nhất.",
  },
  {
    title: "Dịch vụ xét nghiệm",
    description:
      "Chăm sóc và điều trị chuyên khoa dịch vụ xét nghiệm với thiết bị hiện đại nhất.",
  },
];
