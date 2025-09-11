import "./globals.css";
import type { Metadata } from "next";
import { roboto } from "@/font/font";

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
      <body className={roboto.className}>{children}</body>
    </html>
  );
}
