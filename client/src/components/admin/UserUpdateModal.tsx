"use client";

import { EmployeeUpdateModal } from "@/components/employee";
import { useUserManagementContext } from "@/contexts";

export default function UserUpdateModal() {
  const { state, closeModal } = useUserManagementContext();
  return (
    <>
      {state.selectedUser && state.selectedUser.employee && (
        <EmployeeUpdateModal
          isOpen={state.activeModal === "update"}
          setIsOpen={(isOpen) => !isOpen && closeModal()}
          employee={state.selectedUser}
          isAdmin={true}
          onSuccess={closeModal}
        />
      )}
    </>
  );
}
