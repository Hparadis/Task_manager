// actions.js
import { state } from "./state.js";
import { api } from "./api.js";
import { addTaskToUI, removeTaskFromUI } from "./ui/tasksView.js";
import { addNotificationToUI ,showNotificationToast} from "./ui/notificationsView.js";
import { triggerBrowserNotification } from "./notifications.js";

export const actions = {
    setTasks(tasks) {
        state.tasks = tasks;
    },

    async loadTasks() {
        const data = await api.getTasks();
        state.tasks = data.tasks || [];
    
        const list = document.getElementById("taskList");
        list.innerHTML = "";
    
        state.tasks.forEach(task => addTaskToUI(task));
    },

    async createTask(title) {
        const data = await api.createTask(title);
    
        if (!data.task) {
            console.warn("⚠️ Backend didn't return task, reloading from server");
    
            // fallback
            const refreshed = await api.getTasks();
            state.tasks = refreshed.tasks || [];

            
            return;
        }
    
        const newTask = data.task;
    
        state.tasks.unshift(newTask);

        addTaskToUI(newTask);
    
    },

    async updateTask(id, title, due_time, reminder) {
        await api.updateTask(id, { title, due_time, reminder });

        const t = state.tasks.find(t => t.id === id);
        if (t) {
            t.title = title;
            t.due_time = due_time;
            t.reminder = reminder;
        }

    },

    async deleteTask(id) {
        await api.deleteTask(id);

        state.tasks = state.tasks.filter(t => t.id !== id);
        removeTaskFromUI(id);
    },
    async addNotification(notif) {
        const exists = state.notifications.find(n => n.title === notif.title);
        if (exists) return;
    
        state.notifications.unshift(notif);
    
        localStorage.setItem("notifications", JSON.stringify(state.notifications));
    
        addNotificationToUI(notif);
    },
    async  handleIncomingNotification({ taskId, title }) {
        const exists = state.notifications.find(n => n.taskId === taskId);
        if (exists) return;
    
        const notif = {
            id: Date.now(),
            taskId,
            title,
            read: false
        };
    
        // state.notifications.unshift(notif);
        // localStorage.setItem("notifications", JSON.stringify(state.notifications));
    
        // addNotificationToUI(notif); // no full render
        triggerBrowserNotification(title);

        showNotificationToast(notif);
    }
};