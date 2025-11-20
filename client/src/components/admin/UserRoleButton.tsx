"use client";

import { useEffect, useRef, useMemo } from "react";
import Icon from "@/components/shared/Icon";
import { useUserManagementContext } from "@/contexts";
import { UserManagementUtils } from "@/lib/client";
import userStyles from "@/styles/admin-user-management.module.css";

export default function UserRoleButton() {
  const { state, setToggleDropdown, closeDropdown, setRole } =
    useUserManagementContext();
  const visibleRoles = useMemo(() => UserManagementUtils.getVisibleRoles(), []);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeDropdown]);

  return (
    <div className={userStyles["dropdown-container"]} ref={dropdownRef}>
      <button
        onClick={setToggleDropdown}
        className={userStyles["dropdown-btn"]}
        type="button"
      >
        {UserManagementUtils.RoleNames[state.selectedRole] ||
          state.selectedRole}
        <div className="w-3 h-3 flex items-center justify-center">
          <Icon
            name="ChevronDown"
            className={`${userStyles["dropdown-icon"]} ${state.isDropdownOpen && userStyles["dropdown-icon-open"]}`}
          />
        </div>
      </button>

      {state.isDropdownOpen && (
        <div className={userStyles["dropdown-menu"]}>
          <ul>
            {visibleRoles.map((role) => (
              <li key={role}>
                <button
                  onClick={() => {
                    setRole(role);
                  }}
                  className={userStyles["dropdown-menu-item"]}
                >
                  {UserManagementUtils.RoleNames[role] || role}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
