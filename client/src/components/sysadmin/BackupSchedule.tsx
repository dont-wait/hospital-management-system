"use client";

import { useState } from "react";
import { Clock, Calendar, Power, Edit2 } from "lucide-react";

interface ScheduleItem {
  id: string;
  name: string;
  type: "FULL" | "DIFF" | "LOG";
  dayOfWeek?: number; // 0=CN, 1=T2, ..., 6=T7
  time: string; // HH:mm format
  intervalMinutes?: number; // For LOG backup
  enabled: boolean;
  lastRun: string;
}

interface BackupScheduleProps {
  schedules?: ScheduleItem[];
  onToggleSchedule?: (id: string) => void;
  onEditSchedule?: (schedule: ScheduleItem) => void;
}

export default function BackupSchedule({
  schedules = [],
  onToggleSchedule,
  onEditSchedule,
}: BackupScheduleProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ScheduleItem>>({});
  const [localSchedules, setLocalSchedules] = useState<ScheduleItem[]>([]);

  const daysOfWeek = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

  const defaultSchedules: ScheduleItem[] = schedules.length > 0 ? schedules : [
    {
      id: "1",
      name: "Full Backup",
      type: "FULL",
      dayOfWeek: 1, // Thứ 2
      time: "00:00",
      enabled: true,
      lastRun: "01/12/2025 00:00",
    },
    {
      id: "2",
      name: "Differential Backup",
      type: "DIFF",
      time: "00:30",
      enabled: true,
      lastRun: "06/12/2025 00:30",
    },
    {
      id: "3",
      name: "Log Backup",
      type: "LOG",
      intervalMinutes: 15,
      time: "00:00",
      enabled: false,
      lastRun: "06/12/2025 14:45",
    },
  ];

  // Initialize local schedules
  useState(() => {
    setLocalSchedules(defaultSchedules);
  });

  const handleEdit = (schedule: ScheduleItem) => {
    setEditingId(schedule.id);
    setEditForm(schedule);
  };

  const handleSave = (id: string) => {
    const updatedSchedule = { ...editForm, id } as ScheduleItem;
    setLocalSchedules(prev =>
      prev.map(s => (s.id === id ? updatedSchedule : s))
    );
    onEditSchedule?.(updatedSchedule);
    setEditingId(null);
  };

  const handleToggle = (id: string) => {
    setLocalSchedules(prev =>
      prev.map(s => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
    onToggleSchedule?.(id);
  };

  const getScheduleDescription = (schedule: ScheduleItem) => {
    if (schedule.type === "FULL") {
      return `Hàng tuần vào ${daysOfWeek[schedule.dayOfWeek!]} lúc ${schedule.time}`;
    } else if (schedule.type === "DIFF") {
      return `Hàng ngày lúc ${schedule.time}`;
    } else {
      return `Mỗi ${schedule.intervalMinutes} phút`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-east-bay" />
        <h3 className="text-lg font-semibold text-martinique">
          Lịch trình Backup Tự động
        </h3>
      </div>

      <div className="space-y-3">
        {localSchedules.map((schedule) => (
          <div
            key={schedule.id}
            className="p-4 bg-gray-50 rounded-lg border border-gray-200"
          >
            {editingId === schedule.id ? (
              // Edit Mode
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-martinique">{schedule.name}</h4>
                  <span className="px-2 py-1 bg-east-bay/20 text-east-bay text-xs font-medium rounded">
                    {schedule.type}
                  </span>
                </div>

                {schedule.type === "FULL" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ngày trong tuần
                      </label>
                      <select
                        value={editForm.dayOfWeek ?? schedule.dayOfWeek}
                        onChange={(e) =>
                          setEditForm({ ...editForm, dayOfWeek: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        {daysOfWeek.map((day, idx) => (
                          <option key={idx} value={idx}>
                            {day}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thời gian
                      </label>
                      <input
                        type="time"
                        value={editForm.time ?? schedule.time}
                        onChange={(e) =>
                          setEditForm({ ...editForm, time: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}

                {schedule.type === "DIFF" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Thời gian (hàng ngày)
                    </label>
                    <input
                      type="time"
                      value={editForm.time ?? schedule.time}
                      onChange={(e) =>
                        setEditForm({ ...editForm, time: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {schedule.type === "LOG" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Khoảng thời gian (phút)
                    </label>
                    <select
                      value={editForm.intervalMinutes ?? schedule.intervalMinutes}
                      onChange={(e) =>
                        setEditForm({ ...editForm, intervalMinutes: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={15}>15 phút</option>
                      <option value={30}>30 phút</option>
                      <option value={60}>60 phút</option>
                    </select>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleSave(schedule.id)}
                    className="flex-1 px-4 py-2 bg-east-bay text-white rounded-lg hover:bg-mauve"
                  >
                    Lưu
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-east-bay/10 rounded-lg">
                      <Clock className="w-5 h-5 text-east-bay" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-martinique">{schedule.name}</h4>
                        <span className="px-2 py-0.5 bg-east-bay/20 text-east-bay text-xs font-medium rounded">
                          {schedule.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {getScheduleDescription(schedule)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(schedule)}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit2 className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleToggle(schedule.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        schedule.enabled ? "bg-east-bay" : "bg-gray-300"
                      }`}
                      title={schedule.enabled ? "Tắt" : "Bật"}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          schedule.enabled ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Power
                      className={`w-4 h-4 ${
                        schedule.enabled ? "text-east-bay" : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        schedule.enabled ? "text-east-bay" : "text-gray-400"
                      }`}
                    >
                      {schedule.enabled ? "Đang hoạt động" : "Đã tắt"}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    Chạy lần cuối: {schedule.lastRun}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
