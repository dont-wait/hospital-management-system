import "./globals.css";
import "react-loading-skeleton/dist/skeleton.css";
import type { Metadata } from "next";
import { roboto } from "@/font/font";
import { UserAuthProvider } from "@/contexts/UserAuthContext";
import { Navigation } from "@/components/shared/Navigation";
import { ToastProvider } from "@/contexts/ToastContext";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { Sidebar } from "@/components/shared/Sidebar";

export const metadata: Metadata = {
  title: "Medica Hospital",
  description:
    "Medical care with our dedicated team of professionals and comprehensive healthcare services.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <ToastProvider>
          <UserAuthProvider>
            <SidebarProvider>
              <Navigation />
              <main>{children}</main>
              <Sidebar />
            </SidebarProvider>
          </UserAuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
