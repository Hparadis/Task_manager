export function triggerBrowserNotification(title, notifData) {
    if (Notification.permission === "granted") {
        const notif = new Notification("Reminder", { body: title });

        notif.onclick = () => {
            window.focus();

            // ✅ NOW add to app panel
            actions.addNotification(notifData);
        };
    }
}