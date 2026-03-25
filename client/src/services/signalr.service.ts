import * as signalR from "@microsoft/signalr";

let connection: signalR.HubConnection | null = null;

export const startConnection = async (userId: string) => {

    if (connection) return; // ❗ tránh tạo lại

    connection = new signalR.HubConnectionBuilder()
        .withUrl(`http://localhost:5296/notificationHub?userId=${userId}`)
        .withAutomaticReconnect()
        .build();

    try {
        await connection.start();
        console.log("✅ Connected");
    } catch (err) {
        console.error("❌ Error:", err);
    }
};

export const onReceiveNotification = (
    callback: (user: string, message: string) => void
): void => {

    if (!connection) return;

    // 🔥 tránh bị đăng ký nhiều lần
    connection.off("ReceiveNotification");

    connection.on("ReceiveNotification", (user: string, message: string) => {
        callback(user, message);
    });
};

export const sendNotification = async (targetUser: string, message: string) => {
    if (!connection) {
        console.warn("⚠️ Connection not started");
        return;
    }

    try {
        await connection.invoke("SendNotification", targetUser, message);
    } catch (err) {
        console.error("❌ Send Error:", err);
    }
};
