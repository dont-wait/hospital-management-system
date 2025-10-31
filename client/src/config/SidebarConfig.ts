import { 
  Users, 
  Lock, 
  Pencil, 
  LayoutDashboard, 
  UserRound, 
  Stethoscope, 
  Calendar, 
  Settings 
} from "@/lib/client";

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

export const AdminSidebarItems = [
  {
    route: "/admin/dashboard",
    title: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    route: "/admin/patients",
    title: "Quản Lý Bệnh Nhân",
    icon: UserRound,
  },
  {
    route: "/admin/doctors",
    title: "Quản Lý Bác Sĩ",
    icon: Stethoscope,
  },
  {
    route: "/admin/appointments",
    title: "Lịch Hẹn",
    icon: Calendar,
  },
  {
    route: "/admin/users",
    title: "Quản Lý Người Dùng",
    icon: Users,
  },
  {
    route: "/admin/settings",
    title: "Cài Đặt",
    icon: Settings,
  },
]