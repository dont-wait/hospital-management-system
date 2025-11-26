"use client";

import Icon from "@/components/shared/Icon";
import { useUserManagementContext } from "@/contexts";
import userStyles from "@/styles/admin-user-management.module.css";

export default function UserSearch() {
  const { state, setSearchTerm } = useUserManagementContext();
  return (
    <div className={userStyles["search-container"]}>
      <div className="h-5 w-5 flex items-center justify-center">
        <Icon name="Search" className={userStyles["search-icon"]} />
      </div>
      <input
        type="text"
        placeholder="Tìm kiếm theo tên, email, SĐT, CCCD..."
        value={state.searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
        className={userStyles["search-input"]}
      />
    </div>
  );
}
