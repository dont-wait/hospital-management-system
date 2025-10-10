"use client";

import { useSidebar } from "@/contexts/SidebarContext";
import { CircleX } from "@/lib/client/utils";

export function Sidebar() {
  const { isOpen, closeSidebar, content } = useSidebar();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gray-500">
            <h2 className="text-xl font-semibold text-white">Cài đặt</h2>
            <button
              onClick={closeSidebar}
              className="p-2 hover:bg-black rounded-lg transition-colors"
              aria-label="Close sidebar"
            >
              <CircleX className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">{content}</div>
        </div>
      </aside>
    </>
  );
}
