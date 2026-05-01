import { actions } from "./actions.js";

export function initSocket() {
    const socket = io("http://127.0.0.1:5000", {
    transports: ["polling"] // 🔥 disable websocket for now
});

    socket.on("connect", () => {
        console.log("Connected:", socket.id);
    });

    socket.on("task_due", (data) => {
        actions.addNotification({
            id: Date.now(),
            title: data.title,
            read: false
        });

        triggerBrowserNotification(data.title);
    });
}

function triggerBrowserNotification(title) {
    if (Notification.permission === "granted") {
        new Notification("Reminder", { body: title });
    }
}