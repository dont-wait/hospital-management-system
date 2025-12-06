"use client";

import { Database } from "lucide-react";

interface Backup {
  id: string;
  filename: string;
  createdAt: string;
  type: "auto" | "manual";
  backupType: "FULL" | "DIFF" | "LOG";
}

interface RecentBackupsProps {
  backups?: Backup[];
}

export default function RecentBackups({ backups = [] }: RecentBackupsProps) {
  const defaultBackups: Backup[] = backups.length > 0 ? backups : [
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Database className="w-5 h-5 text-east-bay" />
        <h3 className="text-lg font-semibold text-martinique">Backup gần đây</h3>
      </div>

      <div className="space-y-3">
        {defaultBackups.map((backup) => (
          <div
            key={backup.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="p-2 bg-east-bay/10 rounded-lg">
                <Database className="w-5 h-5 text-east-bay" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 text-sm">
                  {backup.filename}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDateTime(backup.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getBackupTypeColor(backup.backupType)}`}>
                {backup.backupType}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  backup.type === "auto"
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {backup.type === "auto" ? "Auto" : "Manual"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
