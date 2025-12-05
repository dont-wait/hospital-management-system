import {
  SidebarProvider,
  ModalProvider,
  BookingProvider,
  AppointmentManagemetnProvider,
} from "@/contexts";
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
          <AppointmentManagemetnProvider>
            <Navbar />
            <section>{children}</section>
            <Sidebar />
          </AppointmentManagemetnProvider>
        </SidebarProvider>
      </ModalProvider>
    </BookingProvider>
  );
}
