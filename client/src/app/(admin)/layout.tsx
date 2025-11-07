import { SidebarProvider } from "@/contexts";
import SidebarForAdmin from "@/components/shared/SidebarForAdmin";
import "react-loading-skeleton/dist/skeleton.css";
import "@/styles/globals.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <section>{children}</section>
      <SidebarForAdmin />
    </SidebarProvider>
  );
}
