import userStyles from "@/styles/admin-user-management.module.css";

export default function UserAddButton() {
  return (
    <button className={userStyles["add-user-btn"]}>
      <span>+</span> Thêm người dùng
    </button>
  );
}
