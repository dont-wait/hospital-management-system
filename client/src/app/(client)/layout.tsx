import type { Metadata } from "next";
import { Navigation, Sidebar } from "@/components";
import "react-loading-skeleton/dist/skeleton.css";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Medica Hospital",
  description:
    "Medical care with our dedicated team of professionals and comprehensive healthcare services.",
};

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      <main>{children}</main>
      <Sidebar />
    </>
  );
}
