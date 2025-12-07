import { getApiInstance, getConfig } from "@/axios";
import type {
  InspectBackupRequest,
  InspectBackupResponse,
  RestoreDatabaseRequest,
  RestoreDatabaseResponse,
  ApiResponse,
} from "@/types";

export class BackupService {
  public static async createBackup(type: "FULL" | "DIFF" | "LOG") {
    const api = getApiInstance();
    const config = getConfig();
    const response = await api.post(
      "/backup",
      { BackupType: type },
      config,
    );

    return response.data;
  }

  public static async getHistoryBackup() {
    const api = getApiInstance();
    const config = getConfig();
    const response = await api.get("/backup/history", config);

    return response.data.data;
  }

  public static async inspectBackupFiles(
    request: InspectBackupRequest
  ): Promise<ApiResponse<InspectBackupResponse>> {
    const api = getApiInstance();
    const config = getConfig();
    const response = await api.post<ApiResponse<InspectBackupResponse>>(
      "/backup/inspect",
      request,
      config
    );

    return response.data;
  }

  public static async restoreDatabase(
    request: RestoreDatabaseRequest
  ): Promise<ApiResponse<RestoreDatabaseResponse>> {
    const api = getApiInstance();
    const config = getConfig();
    const response = await api.post<ApiResponse<RestoreDatabaseResponse>>(
      "/backup/restore",
      request,
      config
    );

    return response.data;
  }
}
