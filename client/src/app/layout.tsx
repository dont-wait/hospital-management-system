import "./globals.css";
import type { Metadata } from "next";
import { roboto } from "@/font/font";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import { ToastProvider } from "@/contexts/ToastContext";

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
          <AuthProvider>
            <Navigation />
            <main>{children}</main>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
