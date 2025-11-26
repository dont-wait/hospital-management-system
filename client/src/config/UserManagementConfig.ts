import { UserListState } from "@/types";

export const initialUserManagementState: UserListState = {
  isDropdownOpen: false,
  selectedRole: "doctor",
  searchTerm: "",
  selectedUser: null,
  activeModal: null,
} as const;
