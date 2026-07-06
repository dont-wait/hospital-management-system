"use client";

import { createContext, useContext, useReducer, ReactNode } from "react";
import { initialUserManagementState } from "@/config";
import { AuthUserWithoutTokens, Roles, UserListState } from "@/types";

type UserListAction =
  | { type: "TOGGLE_DROPDOWN" }
  | { type: "CLOSE_DROPDOWN" }
  | { type: "SET_ROLE"; payload: Exclude<Roles, "admin" | "guest"> }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "OPEN_VIEW_MODAL"; payload: AuthUserWithoutTokens }
  | { type: "OPEN_UPDATE_MODAL"; payload: AuthUserWithoutTokens }
  | { type: "CLOSE_MODAL" }
  | { type: "REFRESH_USERS" };

function reducer(state: UserListState, action: UserListAction): UserListState {
  switch (action.type) {
    case "TOGGLE_DROPDOWN":
      return { ...state, isDropdownOpen: !state.isDropdownOpen };
    case "CLOSE_DROPDOWN":
      return { ...state, isDropdownOpen: false };
    case "SET_ROLE":
      return { ...state, selectedRole: action.payload, isDropdownOpen: false };
    case "SET_SEARCH":
      return { ...state, searchTerm: action.payload };
    case "OPEN_VIEW_MODAL":
      return { ...state, selectedUser: action.payload, activeModal: "view" };
    case "OPEN_UPDATE_MODAL":
      return { ...state, selectedUser: action.payload, activeModal: "update" };
    case "CLOSE_MODAL":
      return { ...state, activeModal: null };
    case "REFRESH_USERS":
      return { ...state, refreshKey: state.refreshKey + 1 };
    default:
      return state;
  }
}

interface UserManagementContext {
  state: UserListState;
  setSearchTerm: (searchValue: string) => void;
  setToggleDropdown: () => void;
  closeDropdown: () => void;
  setRole: (role: Exclude<Roles, "admin" | "guest">) => void;
  closeModal: () => void;
  viewUser: (user: AuthUserWithoutTokens) => void;
  updateUser: (user: AuthUserWithoutTokens) => void;
  refreshUsers: () => void;
}

const UserManagementContext = createContext<UserManagementContext | null>(null);

export function UserManagementProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialUserManagementState);

  const setSearchTerm = (searchTerm: string) => {
    dispatch({ type: "SET_SEARCH", payload: searchTerm });
  };

  const setToggleDropdown = () => {
    dispatch({ type: "TOGGLE_DROPDOWN" });
  };

  const closeDropdown = () => {
    dispatch({ type: "CLOSE_DROPDOWN" });
  };

  const setRole = (role: Exclude<Roles, "admin" | "guest">) => {
    dispatch({ type: "SET_ROLE", payload: role });
  };

  const closeModal = () => {
    dispatch({ type: "CLOSE_MODAL" });
  };

  const viewUser = (user: AuthUserWithoutTokens) => {
    dispatch({ type: "OPEN_VIEW_MODAL", payload: user });
  };

  const updateUser = (user: AuthUserWithoutTokens) => {
    dispatch({ type: "OPEN_UPDATE_MODAL", payload: user });
  };

  const refreshUsers = () => {
    dispatch({ type: "REFRESH_USERS" });
  };

  return (
    <UserManagementContext.Provider
      value={{
        state,
        setSearchTerm,
        setToggleDropdown,
        closeDropdown,
        setRole,
        closeModal,
        viewUser,
        updateUser,
        refreshUsers,
      }}
    >
      {children}
    </UserManagementContext.Provider>
  );
}

export function useUserManagementContext() {
  const ctx = useContext(UserManagementContext);
  if (!ctx) {
    throw new Error(
      "useUserManagementContext must be used inside userManagementProvider",
    );
  }
  return ctx;
}
