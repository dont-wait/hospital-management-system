"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useReducer,
} from "react";

type SidebarPosition = "left" | "right";

interface SidebarState {
  isOpen: boolean;
  showCloseButton: boolean;
  position: SidebarPosition;
  content: ReactNode | null;
  title: string | ReactNode;
}

type SidebarAction =
  | { type: "TOGGLE" }
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "SET_CONTENT"; payload: ReactNode | null }
  | { type: "SET_TITLE"; payload: string | ReactNode }
  | { type: "SET_SHOW_CLOSE_BUTTON"; payload: boolean }
  | { type: "SET_POSITION"; payload: SidebarPosition };

const initialState: SidebarState = {
  isOpen: false,
  showCloseButton: true,
  position: "right",
  content: null,
  title: "",
};

function sidebarReducer(state: SidebarState, action: SidebarAction): SidebarState {
  switch (action.type) {
    case "TOGGLE":
      return { ...state, isOpen: !state.isOpen };
    case "OPEN":
      return { ...state, isOpen: true };
    case "CLOSE":
      return { ...state, isOpen: false, content: null };
    case "SET_CONTENT":
      return { ...state, content: action.payload };
    case "SET_TITLE":
      return { ...state, title: action.payload };
    case "SET_SHOW_CLOSE_BUTTON":
      return { ...state, showCloseButton: action.payload };
    case "SET_POSITION":
      return { ...state, position: action.payload };
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
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(sidebarReducer, initialState);

  const toggleSidebar = () => dispatch({ type: "TOGGLE" });
  const openSidebar = () => dispatch({ type: "OPEN" });
  const closeSidebar = () => dispatch({ type: "CLOSE" });
  const setContent = (content: ReactNode | null) => dispatch({ type: "SET_CONTENT", payload: content });
  const setTitle = (title: string | ReactNode) => dispatch({ type: "SET_TITLE", payload: title });
  const setShowCloseButton = (show: boolean) => dispatch({ type: "SET_SHOW_CLOSE_BUTTON", payload: show });
  const setPosition = (pos: SidebarPosition) => dispatch({ type: "SET_POSITION", payload: pos });

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
