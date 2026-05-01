import { state } from "./state.js";
import { actions } from "./actions.js";

export function startReminderEngine() {
    setInterval(() => {
        const now = new Date();

        state.tasks.forEach(task => {
            if (!task.due_time || !task.reminder) return;

            const due = new Date(task.due_time);

            const key = "notif_" + task.id + "_" + task.due_time;
            const alreadyTriggered = localStorage.getItem(key);

            if (due <= now && !alreadyTriggered) {
                actions.handleIncomingNotification({
                    taskId: task.id,
                    title: task.title
                });
            
                localStorage.setItem(key, "1");
            }
        });

    }, 1000); 
}