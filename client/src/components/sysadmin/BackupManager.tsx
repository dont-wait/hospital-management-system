"use client";

import { useState } from "react";
import { Database, Download, Trash2, Hand } from "lucide-react";

interface BackupItem {
  id: string;
  filename: string;
  createdAt: string;
  type: "auto" | "manual";
  backupType: "FULL" | "DIFF" | "LOG";
}

interface BackupManagerProps {
  backups?: BackupItem[];
  onCreateBackup?: (type: "FULL" | "DIFF" | "LOG") => void;
  onDeleteBackup?: (id: string) => void;
}

export default function BackupManager({
  backups = [],
  onCreateBackup,
  onDeleteBackup,
}: BackupManagerProps) {
  const [selectedType, setSelectedType] = useState<"FULL" | "DIFF" | "LOG">("FULL");

  const defaultBackups: BackupItem[] = backups.length > 0 ? backups : [
    {
      id: "1",
      filename: "Hospital_FULL_2025_12_06_000000.bak",
      createdAt: "2025-12-06T00:00:00",
      type: "auto",
      backupType: "FULL",
    },
    {
      id: "2",
      filename: "Hospital_DIFF_2025_12_06_003000.bak",
      createdAt: "2025-12-06T00:30:00",
      type: "auto",
      backupType: "DIFF",
    },
    {
      id: "3",
      filename: "Hospital_LOG_2025_12_06_014500.trn",
      createdAt: "2025-12-06T01:45:00",
      type: "auto",
      backupType: "LOG",
    },
    {
      id: "4",
      filename: "Hospital_FULL_Manual_2025_12_05_103000.bak",
      createdAt: "2025-12-05T10:30:00",
      type: "manual",
      backupType: "FULL",
    },
  ];

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getBackupTypeColor = (type: string) => {
    switch (type) {
      case "FULL":
        return "bg-east-bay/20 text-east-bay";
      case "DIFF":
        return "bg-mauve/20 text-mauve";
      case "LOG":
        return "bg-martinique/20 text-martinique";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Manual Backup Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Hand className="w-5 h-5 text-east-bay" />
          <h3 className="text-lg font-semibold text-martinique">Backup Thủ công</h3>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn loại backup
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as "FULL" | "DIFF" | "LOG")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="FULL">FULL - Sao lưu toàn bộ</option>
              <option value="DIFF">DIFF - Sao lưu sai khác</option>
              <option value="LOG">LOG - Sao lưu nhật ký</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => onCreateBackup?.(selectedType)}
              className="px-6 py-2 bg-east-bay text-white rounded-lg hover:bg-mauve transition-colors font-medium"
            >
              Tạo Backup
            </button>
          </div>
        </div>

        <div className="mt-4 p-3 bg-east-bay/10 border border-east-bay/20 rounded-lg">
          <p className="text-sm text-martinique">
            <strong>FULL:</strong> Sao lưu toàn bộ database • 
            <strong> DIFF:</strong> Sao lưu thay đổi từ FULL gần nhất • 
            <strong> LOG:</strong> Sao lưu transaction log
          </p>
        </div>
      </div>

      {/* Backup List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-martinique">
            Danh sách Backup Files
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Tổng số: {defaultBackups.length} backup files
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Tên File
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Loại Backup
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Nguồn
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Ngày giờ tạo
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {defaultBackups.map((backup) => (
                <tr key={backup.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-east-bay/10 rounded-lg">
                        <Database className="w-4 h-4 text-east-bay" />
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {backup.filename}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${getBackupTypeColor(
                        backup.backupType
                      )}`}
                    >
                      {backup.backupType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        backup.type === "auto"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {backup.type === "auto" ? "Tự động" : "Thủ công"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {formatDateTime(backup.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          window.open(`/api/backup/download/${backup.id}`);
                        }}
                        className="p-2 text-east-bay hover:bg-east-bay/10 rounded-lg transition-colors"
                        title="Tải xuống"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (
                            confirm(
                              `Bạn có chắc muốn xóa backup "${backup.filename}"?`
                            )
                          ) {
                            onDeleteBackup?.(backup.id);
                          }
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa backup"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
