import { SidebarProvider, ModalProvider, BookingProvider } from "@/contexts";
import { Sidebar } from "@/components/shared/Sidebar";
import { Navbar } from "@/components/shared/Navbar";
import "react-loading-skeleton/dist/skeleton.css";
import "@/styles/globals.css";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BookingProvider>
      <ModalProvider>
        <SidebarProvider>
          <Navbar />
          <section>{children}</section>
          <Sidebar />
        </SidebarProvider>
      </ModalProvider>
    </BookingProvider>
  );
}
