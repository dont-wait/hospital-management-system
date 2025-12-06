"use client";

import { useState } from "react";
import AdminContentHeader from "@/components/admin/AdminContentHeader";
import BackupManager from "@/components/sysadmin/BackupManager";
import BackupSchedule from "@/components/sysadmin/BackupSchedule";
import RecentBackups from "@/components/sysadmin/RecentBackups";
import styles from "@/styles/admin.module.css";
import { useToast } from "@/contexts";

export default function BackupsPage() {
  const { showToast } = useToast();

  const handleCreateBackup = async (type: "FULL" | "DIFF" | "LOG") => {
    try {
      showToast(
        `Đang tạo ${type} backup...`,
        "success",
      );
      // TODO: Call API here
    } catch (error) {
      showToast(
        "Có lỗi xảy ra khi tạo backup",
        "error",
      );
    }
  };

  const handleDeleteBackup = async (id: string) => {
    try {
      showToast(
        "Xóa backup thành công!",
        "success",
      );
      // TODO: Call API here
    } catch (error) {
      showToast(
        "Có lỗi xảy ra khi xóa backup",
        "error",
      );
    }
  };

  const handleToggleSchedule = async (id: string) => {
    try {
      showToast(
        "Cập nhật lịch trình thành công!",
        "success",
      );
      // TODO: Call API here
    } catch (error) {
      showToast(
        "Có lỗi xảy ra khi cập nhật lịch trình",
        "error",
      );
    }
  };

  const handleEditSchedule = async (schedule: any) => {
    try {
      showToast(
        "Cập nhật cấu hình thành công!",
        "success",
      );
      // TODO: Call API here
    } catch (error) {
      showToast(
        "Có lỗi xảy ra khi cập nhật cấu hình",
        "error",
      );
    }
  };

  return (
    <div className={styles["admin-container"]}>
      <AdminContentHeader
        title="Quản Lý Backup & Recovery"
        description="Sao lưu và quản lý dữ liệu hệ thống"
      />

      {/* Backup Manager */}
      <div className="mb-6">
        <BackupManager
          onCreateBackup={handleCreateBackup}
          onDeleteBackup={handleDeleteBackup}
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent Backups */}
        <RecentBackups />

        {/* Backup Schedule */}
        <BackupSchedule
          onToggleSchedule={handleToggleSchedule}
          onEditSchedule={handleEditSchedule}
        />
      </div>
    </div>
  );
}
