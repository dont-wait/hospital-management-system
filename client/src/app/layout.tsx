import type { Metadata } from "next";
import { roboto } from "@/font";
import { UserAuthProvider, ToastProvider, SidebarProvider } from "@/contexts";
import { Navigation, Sidebar } from "@/components";
import "react-loading-skeleton/dist/skeleton.css";
import "@/styles/globals.css";

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
              <main>{children}</main>
            </SidebarProvider>
          </UserAuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
