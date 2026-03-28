import * as signalR from "@microsoft/signalr";

let notificationConnection: signalR.HubConnection | null = null;
let schedulingConnection: signalR.HubConnection | null = null;
let schedulingStartPromise: Promise<void> | null = null;
let schedulingUpdateCallback: ((target: string, message: string) => void) | null = null;

const attachSchedulingUpdateListener = (): void => {
    if (!schedulingConnection || !schedulingUpdateCallback) return;

    schedulingConnection.off("ReceiveSchedulingUpdate");
    schedulingConnection.on("ReceiveSchedulingUpdate", (target: string, message: string) => {
        schedulingUpdateCallback?.(target, message);
    });
};

const getHubBaseUrl = (): string => {
    const rawUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5296";
    const normalizedUrl = rawUrl.replace(/\/+$/, "");

    // API baseURL thường là .../api nhưng Hub đang được map ở root path.
    return normalizedUrl.endsWith("/api")
        ? normalizedUrl.slice(0, -4)
        : normalizedUrl;
};

export const startConnection = async (_userId?: string) => {

    if (notificationConnection) return;
    const hubBaseUrl = getHubBaseUrl();

    notificationConnection = new signalR.HubConnectionBuilder()
        .withUrl(`${hubBaseUrl}/notificationHub`)
        .withAutomaticReconnect()
        .build();

    try {
        await notificationConnection.start();
        console.log("✅ Connected");
    } catch (err) {
        console.error("❌ Error:", err);
        notificationConnection = null;
    }
};

export const onReceiveNotification = (
    callback: (user: string, message: string) => void
): void => {

    if (!notificationConnection) return;

    notificationConnection.off("ReceiveNotification");

    notificationConnection.on("ReceiveNotification", (user: string, message: string) => {
        callback(user, message);
    });
};

export const sendNotification = async (targetUser: string, message: string) => {
    if (!notificationConnection) {
        console.warn("⚠️ Connection not started");
        return;
    }

    try {
        await notificationConnection.invoke("SendNotification", targetUser, message);
    } catch (err) {
        console.error("❌ Send Error:", err);
    }
};

export const startSchedulingConnection = async (_userId?: string) => {
    if (schedulingConnection?.state === signalR.HubConnectionState.Connected
        || schedulingConnection?.state === signalR.HubConnectionState.Connecting
        || schedulingConnection?.state === signalR.HubConnectionState.Reconnecting) {
        if (schedulingStartPromise) {
            await schedulingStartPromise;
        }
        return;
    }

    const hubBaseUrl = getHubBaseUrl();
    schedulingConnection = new signalR.HubConnectionBuilder()
        .withUrl(`${hubBaseUrl}/schedulingHub`)
        .withAutomaticReconnect()
        .build();

    attachSchedulingUpdateListener();

    schedulingStartPromise = schedulingConnection.start()
        .then(() => {
            console.log("SchedulingHub connected");
        })
        .catch((err) => {
            const message = err instanceof Error ? err.message : String(err);
            if (!message.toLowerCase().includes("stopped during negotiation")) {
                console.error("SchedulingHub connection error:", err);
            }
            schedulingConnection = null;
            throw err;
        })
        .finally(() => {
            schedulingStartPromise = null;
        });

    await schedulingStartPromise;
};

export const onReceiveSchedulingUpdate = (
    callback: (target: string, message: string) => void,
): void => {
    schedulingUpdateCallback = callback;
    attachSchedulingUpdateListener();
};

export const offReceiveSchedulingUpdate = (): void => {
    schedulingUpdateCallback = null;
    if (!schedulingConnection) return;
    schedulingConnection.off("ReceiveSchedulingUpdate");
};

export const stopSchedulingConnection = async (): Promise<void> => {
    if (!schedulingConnection) return;

    if (schedulingStartPromise) {
        try {
            await schedulingStartPromise;
        } catch {
            // Nếu start thất bại thì connection đã được cleanup trong startSchedulingConnection.
        }
    }

    if (!schedulingConnection) return;
    if (schedulingConnection.state === signalR.HubConnectionState.Disconnected) {
        schedulingConnection = null;
        return;
    }

    await schedulingConnection.stop();
    schedulingConnection = null;
};
