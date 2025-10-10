import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/contexts/SidebarContext";
import {
  Home,
  Users,
  Lock,
  LogOut,
  LogIn,
  itemVariants,
} from "@/lib/client/utils";

const menuItems = [
  {
    route: "/",
    title: "Trang Chủ",
    icon: Home,
  },
  {
    route: "/patient",
    title: "Thông Tin Bệnh Nhân",
    icon: Users,
  },
  {
    route: "/forgot-password",
    title: "Đổi Mật Khẩu",
    icon: Lock,
  },
];

function PatientSidebar() {
  const { logout, isAuthenticated } = useAuth();
  const { closeSidebar } = useSidebar();
  const router = useRouter();

  const handleItemClick = (route: string) => {
    if (route == "/logout") {
      logout();
    } else {
      router.push(route);
    }
    closeSidebar();
  };

  return (
    <div className="flex flex-col" style={{ minHeight: "calc(100vh - 70px)" }}>
      {/* Menu Items */}
      <nav className="flex-1 space-y-3">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={index}
              custom={index}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              whileTap={{ scale: 0.98 }}
              onClick={() => handleItemClick(item.route)}
              className="
                w-full flex items-center gap-4 p-4 rounded-lg
                transition-colors duration-200 text-gray-700 hover:bg-gray-100
              "
            >
              <div className="p-2 rounded-lg transition-colors duration-200 bg-gray-100">
                <Icon size={20} className="text-gray-600" />
              </div>
              <span className="flex-1 text-left font-medium">{item.title}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 space-y-4">
        {!isAuthenticated ? (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => handleItemClick("/login")}
            className="w-full flex items-center gap-4 p-4 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="p-2 rounded-lg bg-gray-100 transition-colors duration-200">
              <LogIn size={20} className="text-gray-600" />
            </div>
            <span className="flex-1 text-left font-medium">Đăng Nhập</span>
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => handleItemClick("/logout")}
            className="w-full flex items-center gap-4 p-4 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-red-100 transition-colors duration-200">
              <LogOut size={20} className="text-gray-600" />
            </div>
            <span className="flex-1 text-left font-medium">Đăng Xuất</span>
          </motion.button>
        )}
      </div>
    </div>
  );
}
export default PatientSidebar;
