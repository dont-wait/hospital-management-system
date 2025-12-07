import { getApiInstance, getConfig } from "@/axios";

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
}
