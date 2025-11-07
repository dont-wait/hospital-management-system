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
}

type SidebarAction =
  | { type: "TOGGLE" }
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "SET_CONTENT"; payload: ReactNode | null }
  | { type: "SET_TITLE"; payload: string | ReactNode }
  | { type: "SET_SHOW_CLOSE_BUTTON"; payload: boolean }
  | { type: "SET_POSITION"; payload: SidebarPosition }
  | { type: "SET_COLOR_BACKGROUND"; payload: string };

const initialState: SidebarState = {
  isOpen: false,
  showCloseButton: true,
  position: "right",
  content: null,
  title: "",
  bgColor: "",
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
    default:
      return state;
  }
}

interface SidebarContextType extends SidebarState {
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  setContent: (content: ReactNode | null) => void;
  setTitle: (title: string | ReactNode) => void;
  setShowCloseButton: (show: boolean) => void;
  setPosition: (pos: SidebarPosition) => void;
  setColorBackground: (color: string) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(sidebarReducer, initialState);

  const toggleSidebar = useCallback(() => dispatch({ type: "TOGGLE" }), []);
  const openSidebar = useCallback(() => dispatch({ type: "OPEN" }), []);
  const closeSidebar = useCallback(() => dispatch({ type: "CLOSE" }), []);
  const setContent = useCallback((content: ReactNode | null) => dispatch({ type: "SET_CONTENT", payload: content }), []);
  const setTitle = useCallback((title: string | ReactNode) => dispatch({ type: "SET_TITLE", payload: title }), []);
  const setShowCloseButton = useCallback((show: boolean) => dispatch({ type: "SET_SHOW_CLOSE_BUTTON", payload: show }), []);
  const setPosition = useCallback((pos: SidebarPosition) => dispatch({ type: "SET_POSITION", payload: pos }), []);
  const setColorBackground = useCallback((color: string) => dispatch({ type: "SET_COLOR_BACKGROUND", payload: color }), []);
  
  return (
    <SidebarContext.Provider
      value={{
        ...state,
        toggleSidebar,
        openSidebar,
        closeSidebar,
        setContent,
        setTitle,
        setShowCloseButton,
        setPosition,
        setColorBackground,
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
