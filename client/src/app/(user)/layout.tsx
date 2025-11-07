import { SidebarProvider } from "@/contexts";
import { Navigation, Sidebar } from "@/components";
import "react-loading-skeleton/dist/skeleton.css";
import "@/styles/globals.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Navigation />
      <section>{children}</section>
      <Sidebar />
    </SidebarProvider>
  );
}
