"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useReducer,
  useCallback,
} from "react";

type SidebarPosition = "left" | "right";

interface SidebarState {
  isOpen: boolean;
  showCloseButton: boolean;
  position: SidebarPosition;
  content: ReactNode | null;
  title: string | ReactNode;
  bgColor: string;
  closeButtonMode: "always" | "mobile-only" | "never";
}

type SidebarAction =
  | { type: "TOGGLE" }
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "SET_CONTENT"; payload: ReactNode | null }
  | { type: "SET_TITLE"; payload: string | ReactNode }
  | { type: "SET_SHOW_CLOSE_BUTTON"; payload: boolean }
  | { type: "SET_POSITION"; payload: SidebarPosition }
  | { type: "SET_COLOR_BACKGROUND"; payload: string }
  | { type: "SET_CLOSE_BUTTON_MODE"; payload: "always" | "mobile-only" | "never" };

const initialState: SidebarState = {
  isOpen: false,
  showCloseButton: true,
  position: "right",
  content: null,
  title: "",
  bgColor: "",
  closeButtonMode: "always",
};

function sidebarReducer(state: SidebarState, action: SidebarAction): SidebarState {
  switch (action.type) {
    case "TOGGLE":
      return { ...state, isOpen: !state.isOpen };
    case "OPEN":
      return { ...state, isOpen: true };
    case "CLOSE":
      return { ...state, isOpen: false };
    case "SET_CONTENT":
      return { ...state, content: action.payload };
    case "SET_TITLE":
      return { ...state, title: action.payload };
    case "SET_SHOW_CLOSE_BUTTON":
      return { ...state, showCloseButton: action.payload };
    case "SET_POSITION":
      return { ...state, position: action.payload };
    case "SET_COLOR_BACKGROUND":
      return { ...state, bgColor: action.payload };
    case "SET_CLOSE_BUTTON_MODE":
      return { ...state, closeButtonMode: action.payload };
    default:
      return state;
  }
}

interface SidebarContextType extends SidebarState {
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  closeSidebarOnMobile: () => void;
  setContent: (content: ReactNode | null) => void;
  setTitle: (title: string | ReactNode) => void;
  setShowCloseButton: (show: boolean) => void;
  setPosition: (pos: SidebarPosition) => void;
  setColorBackground: (color: string) => void;
  setCloseButtonMode: (mode: "always" | "mobile-only" | "never") => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(sidebarReducer, initialState);

  const toggleSidebar = useCallback(() => dispatch({ type: "TOGGLE" }), []);
  const openSidebar = useCallback(() => dispatch({ type: "OPEN" }), []);
  const closeSidebar = useCallback(() => dispatch({ type: "CLOSE" }), []);
  
  // Đóng sidebar chỉ khi ở mobile (dùng cho sidebar có closeButtonMode = "mobile-only")
  const closeSidebarOnMobile = useCallback(() => {
    if (state.closeButtonMode === "mobile-only" && window.innerWidth < 1024) {
      dispatch({ type: "CLOSE" });
    }
  }, [state.closeButtonMode]);
  
  const setContent = useCallback((content: ReactNode | null) => dispatch({ type: "SET_CONTENT", payload: content }), []);
  const setTitle = useCallback((title: string | ReactNode) => dispatch({ type: "SET_TITLE", payload: title }), []);
  const setShowCloseButton = useCallback((show: boolean) => dispatch({ type: "SET_SHOW_CLOSE_BUTTON", payload: show }), []);
  const setPosition = useCallback((pos: SidebarPosition) => dispatch({ type: "SET_POSITION", payload: pos }), []);
  const setColorBackground = useCallback((color: string) => dispatch({ type: "SET_COLOR_BACKGROUND", payload: color }), []);
  const setCloseButtonMode = useCallback((mode: "always" | "mobile-only" | "never") => dispatch({ type: "SET_CLOSE_BUTTON_MODE", payload: mode }), []);
  
  return (
    <SidebarContext.Provider
      value={{
        ...state,
        toggleSidebar,
        openSidebar,
        closeSidebar,
        closeSidebarOnMobile,
        setContent,
        setTitle,
        setShowCloseButton,
        setPosition,
        setColorBackground,
        setCloseButtonMode,
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
