import { UserListState } from "@/types";

export const initialUserManagementState: UserListState = {
  isDropdownOpen: false,
  selectedRole: "doctor",
  searchTerm: "",
  selectedUser: null,
  activeModal: null,
  refreshKey: 0,
} as const;
