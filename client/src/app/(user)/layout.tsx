import { SidebarProvider } from "@/contexts";
import { Sidebar, Navbar } from "@/components";
import "react-loading-skeleton/dist/skeleton.css";
import "@/styles/globals.css";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Navbar />
      <section>{children}</section>
      <Sidebar />
    </SidebarProvider>
  );
}
