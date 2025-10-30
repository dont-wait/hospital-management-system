"use client";

import {
  createContext,
  useState,
  useContext,
  ReactNode,
} from "react";

interface SidebarContextType {
  isOpen: boolean;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  content: ReactNode | null;
  setContent: (content: ReactNode | null) => void;
  showCloseButton: boolean;
  setShowCloseButton: (show: boolean) => void;
  position: "left" | "right";
  setPosition: (position: "left" | "right") => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCloseButton, setShowCloseButton] = useState(true);
  const [position, setPosition] = useState<"left" | "right">("right");
  const [content, setContent] = useState<ReactNode | null>(null);

  const toggleSidebar = () => setIsOpen((prev) => !prev);
  const openSidebar = () => setIsOpen(true);
  const closeSidebar = () => {
    setIsOpen(false);
    setTimeout(() => setContent(null), 300);
  };

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        toggleSidebar,
        openSidebar,
        closeSidebar,
        content,
        setContent,
        showCloseButton,
        setShowCloseButton,
        position,
        setPosition,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
