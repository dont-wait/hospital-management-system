"use client";

import { UserDetail } from "./UserDetail";
import { useUserManagementContext } from "@/contexts";

export default function UserDetailModal() {
  const { state, closeModal } = useUserManagementContext();
  return (
    <>
      {state.selectedUser && (
        <UserDetail
          user={state.selectedUser}
          isOpen={state.activeModal === "view"}
          setIsOpen={(isOpen) => !isOpen && closeModal()}
        />
      )}
    </>
  );
}
