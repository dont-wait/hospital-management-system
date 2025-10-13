import { Users, Lock, Pencil } from "@/lib/client/utils";

export const patientSidebarVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
    },
  }),
} as const;

export const PatientSidebarItems = [
  {
    route: "/patient",
    title: "Thông Tin Bệnh Nhân",
    icon: Users,
  },
  {
    route: "/patient/update",
    title: "Cập Nhật Thông Tin",
    icon: Pencil,
  },

  {
    route: "/forgot-password",
    title: "Đổi Mật Khẩu",
    icon: Lock,
  },
] as const;
