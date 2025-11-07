import type { Metadata } from "next";
import { roboto } from "@/font";
import { UserAuthProvider, ToastProvider } from "@/contexts";
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
            <main>{children}</main>
          </UserAuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
