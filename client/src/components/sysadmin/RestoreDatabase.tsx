"use client";

import { useState, useRef } from "react";
import { Upload, FileCheck, AlertCircle, CheckCircle, XCircle, Loader2, Database } from "lucide-react";
import { BackupService } from "@/services/backup.service";
import { useToast } from "@/contexts";
import type {
  InspectBackupResponse,
  BackupFileMetadata,
  RestoreDatabaseResponse,
} from "@/types";

interface RestoreDatabaseProps {
  onRestoreComplete?: () => void;
}

export default function RestoreDatabase({ onRestoreComplete }: RestoreDatabaseProps) {
  const databaseName = "Hospital";
  const backupPath = "/var/opt/mssql/backups";

  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isInspecting, setIsInspecting] = useState(false);
  const [inspectionResult, setInspectionResult] = useState<InspectBackupResponse | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreResult, setRestoreResult] = useState<RestoreDatabaseResponse | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    setSelectedFiles(fileArray);
    setInspectionResult(null);
    setRestoreResult(null);
  };

  const handleInspect = async () => {
    if (selectedFiles.length === 0) {
      showToast("Vui lòng chọn file backup", "error");
      return;
    }

    setIsInspecting(true);
    setInspectionResult(null);

    try {
      const fileNames = selectedFiles.map((f) => f.name);

      const response = await BackupService.inspectBackupFiles({
        backupPath,
        fileNames,
      });

      if (response.status === 200 && response.data) {
        setInspectionResult(response.data);
        
        if (response.data.validation.isValid) {
          showToast("Backup chain hợp lệ - sẵn sàng restore", "success");
        } else {
          showToast("Backup chain có vấn đề - kiểm tra chi tiết", "error");
        }
      } else {
        showToast(response.message || "Lỗi khi inspect backup files", "error");
      }
    } catch {
      showToast(
      "Có lỗi xảy ra khi inspect backup files",
        "error"
      );
    } finally {
      setIsInspecting(false);
    }
  };

  const handleRestore = async () => {
    if (!inspectionResult || !inspectionResult.validation.isValid) {
      showToast("Backup chain không hợp lệ - không thể restore", "error");
      return;
    }

    if (!window.confirm(
      `⚠️ XÁC NHẬN RESTORE DATABASE\n\n` +
      `Database: ${databaseName}\n` +
      `Số file backup: ${selectedFiles.length}\n\n` +
      `Hành động này sẽ GHI ĐÈ database hiện tại!\n` +
      `Bạn có chắc chắn muốn tiếp tục?`
    )) {
      return;
    }

    setIsRestoring(true);
    setRestoreResult(null);

    try {
      const fileNames = selectedFiles.map((f) => f.name);

      const response = await BackupService.restoreDatabase({
        databaseName,
        backupPath,
        backupFiles: fileNames,
        stopAt: null,
        withRecovery: true,
        forceReplace: true,
      });

      if (response.status === 200 && response.data) {
        setRestoreResult(response.data);
        
        if (response.data.status === "SUCCESS") {
          showToast(
            `Restore database thành công! (${response.data.durationInSeconds.toFixed(1)}s)`,
            "success"
          );
          
          setSelectedFiles([]);
          setInspectionResult(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }

          onRestoreComplete?.();
        } else {
          showToast(`Restore thất bại: ${response.data.message}`, "error");
        }
      } else {
        showToast(response.message || "Lỗi khi restore database", "error");
      }
    } catch {
      showToast(
        "Có lỗi xảy ra khi restore database",
        "error"
      );
    } finally {
      setIsRestoring(false);
    }
  };

  const renderMetadataSummary = (metadata: BackupFileMetadata) => {
    const getBadgeColor = (type: string) => {
      switch (type) {
        case "FULL": return "bg-east-bay/20 text-east-bay";
        case "DIFF": return "bg-mauve/20 text-mauve";
        case "LOG": return "bg-martinique/20 text-martinique";
        default: return "bg-gray-100 text-gray-700";
      }
    };

    return (
      <div key={metadata.fileName} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2 bg-east-bay/10 rounded-lg">
            <Database className="w-5 h-5 text-east-bay" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900 text-sm">
              {metadata.fileName}
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600 mt-1">
              <div>
                <span className="font-semibold">Database:</span> {metadata.databaseName}
              </div>
              <div>
                <span className="font-semibold">Size:</span> {(metadata.backupSize / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getBadgeColor(metadata.backupTypeText)}`}>
            {metadata.backupTypeText}
          </span>
          {metadata.isValid ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500" />
          )}
        </div>

        {metadata.validationErrors.length > 0 && (
          <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
            {metadata.validationErrors.map((error, idx) => (
              <p key={idx} className="text-xs text-red-700">{error}</p>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Upload className="w-5 h-5 text-east-bay" />
        <h3 className="text-lg font-semibold text-martinique">Khôi phục Database</h3>
      </div>

      <div className="mb-6 p-4 bg-east-bay/10 border border-east-bay/20 rounded-lg">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Database:</span> {databaseName}
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Backup Path:</span> {backupPath}
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Chọn file backup
        </label>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".bak,.trn"
          onChange={handleFileSelect}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-east-bay/10 file:text-east-bay hover:file:bg-east-bay/20 transition-colors"
        />
        {selectedFiles.length > 0 && (
          <p className="mt-2 text-sm text-gray-600">
            {selectedFiles.length} file(đã chọn)
          </p>
        )}
      </div>

      <div className="mb-6">
        <button
          onClick={handleInspect}
          disabled={selectedFiles.length === 0 || isInspecting}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-east-bay text-white rounded-lg hover:bg-east-bay/90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
        >
          {isInspecting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Đang kiểm tra...
            </>
          ) : (
            <>
              <FileCheck className="w-5 h-5" />
              Kiểm tra file Backup
            </>
          )}
        </button>
      </div>

      {inspectionResult && (
        <div className="mb-6 space-y-4">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-east-bay" />
            <h4 className="text-lg font-semibold text-martinique">Kết quả kiểm tra</h4>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700">Thông tin Backup Files:</h4>
            {inspectionResult.metadata.map(renderMetadataSummary)}
          </div>

          <div className={`p-4 rounded-lg border-2 ${
            inspectionResult.validation.isValid 
              ? "bg-green-50 border-green-500" 
              : "bg-red-50 border-red-500"
          }`}>
            <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
              {inspectionResult.validation.isValid ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-700">Backup Chain hợp lệ</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span className="text-red-700">Backup Chain không hợp lệ</span>
                </>
              )}
            </h4>

            <div className="space-y-2 text-sm">
              <p>
                <span className="font-semibold">FULL Backup:</span>{" "}
                {inspectionResult.validation.hasFullBackup ? (
                  <span className="text-green-700">{inspectionResult.validation.fullBackupFileName}</span>
                ) : (
                  <span className="text-red-700">Thiếu</span>
                )}
              </p>

              {inspectionResult.validation.hasDifferentialBackup && (
                <p>
                  <span className="font-semibold">DIFF Backup:</span>{" "}
                  {inspectionResult.validation.differentialMatchesBase ? (
                    <span className="text-green-700">{inspectionResult.validation.differentialBackupFileName}</span>
                  ) : (
                    <span className="text-red-700">Không khớp với FULL</span>
                  )}
                </p>
              )}

              {inspectionResult.validation.logBackupCount > 0 && (
                <p>
                  <span className="font-semibold">LOG Backups:</span>{" "}
                  {inspectionResult.validation.logChainContinuous ? (
                    <span className="text-green-700">{inspectionResult.validation.logBackupCount} file(s)</span>
                  ) : (
                    <span className="text-red-700">Chain bị đứt</span>
                  )}
                </p>
              )}
            </div>

            {inspectionResult.validation.errors.length > 0 && (
              <div className="mt-3 p-3 bg-red-100 rounded border border-red-300">
                <p className="font-semibold text-red-800 mb-2">Lỗi:</p>
                {inspectionResult.validation.errors.map((error, idx) => (
                  <p key={idx} className="text-sm text-red-700">{error}</p>
                ))}
              </div>
            )}

            {inspectionResult.validation.warnings.length > 0 && (
              <div className="mt-3 p-3 bg-yellow-100 rounded border border-yellow-300">
                <p className="font-semibold text-yellow-800 mb-2">Cảnh báo:</p>
                {inspectionResult.validation.warnings.map((warning, idx) => (
                  <p key={idx} className="text-sm text-yellow-700">{warning}</p>
                ))}
              </div>
            )}

            {inspectionResult.validation.recommendedRestoreOrder.length > 0 && (
              <div className="mt-3 p-3 bg-east-bay/10 rounded border border-east-bay/20">
                <p className="font-semibold text-east-bay mb-2">Thứ tự restore được đề xuất:</p>
                {inspectionResult.validation.recommendedRestoreOrder.map((order, idx) => (
                  <p key={idx} className="text-sm text-gray-700 font-mono">{order}</p>
                ))}
              </div>
            )}
          </div>

          {inspectionResult.validation.isValid && (
            <button
              onClick={handleRestore}
              disabled={isRestoring}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
            >
              {isRestoring ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang khôi phục...
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5" />
                  Khôi phục Database ngay
                </>
              )}
            </button>
          )}
        </div>
      )}

      {restoreResult && (
        <div className={`p-4 rounded-lg border-2 ${
          restoreResult.status === "SUCCESS"
            ? "bg-green-50 border-green-500"
            : "bg-red-50 border-red-500"
        }`}>
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            {restoreResult.status === "SUCCESS" ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-700">Khôi phục thành công ✓</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-700">Khôi phục thất bại ✗</span>
              </>
            )}
          </h3>

          <div className="space-y-2 text-sm mb-4">
            <p><span className="font-semibold">Database:</span> {restoreResult.databaseName}</p>
            <p><span className="font-semibold">Thời gian:</span> {restoreResult.durationInSeconds.toFixed(2)}s</p>
            <p><span className="font-semibold">Thông báo:</span> {restoreResult.message}</p>
          </div>

          <div className="space-y-2">
            <p className="font-semibold text-sm">Các bước thực hiện:</p>
            {restoreResult.steps.map((step) => (
              <div
                key={step.stepNumber}
                className={`p-2 rounded text-xs ${
                  step.status === "SUCCESS" ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">
                    Step {step.stepNumber}: {step.backupType} - {step.fileName}
                  </span>
                  {step.status === "SUCCESS" ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <p className="text-gray-600 mt-1">{step.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
