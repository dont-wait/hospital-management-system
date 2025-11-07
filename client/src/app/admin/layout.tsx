"use client";

import { useSidebar } from "@/contexts";
import SidebarForAdmin from "@/components/shared/SidebarForAdmin";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
    const { openSidebar } = useSidebar();

    return (
        <div className="flex min-h-screen bg-gray-50">
            <SidebarForAdmin />
            
            <button
                onClick={openSidebar}
                className="lg:hidden fixed top-4 left-4 z-30 p-2 rounded-lg bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors"
                aria-label="Open menu"
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                    />
                </svg>
            </button>

            <main className="flex-1 w-full transition-all duration-300 ease-in-out lg:ml-64 p-4 md:p-6 pt-16 lg:pt-6">
                {children}
            </main>
        </div>
    );
}