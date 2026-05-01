import { render } from "./render.js";
import { initSocket } from "./socket.js";
import { actions } from "./actions.js";
import { api } from "./api.js";
import { createInputBox } from "./ui/tasksView.js";
import { getToken } from "./utils.js";
import { startReminderEngine } from "./reminderEngine.js";

if ("Notification" in window) {
    Notification.requestPermission();
}



const createBtn = document.getElementById("createButton");
createBtn.addEventListener("click", createInputBox);

const savedBtn = document.getElementById("savedTasks");

savedBtn.addEventListener("click", async () => {
    try {
        console.log("📂 Loading saved tasks...");

        const data = await api.getTasks();

        actions.setTasks(data.tasks || []);
        render();

    } catch (err) {
        console.error("❌ Failed to load tasks:", err);
    }
});

const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");

menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("active");
});



window.addEventListener("DOMContentLoaded", async () => {
    startReminderEngine();
    try {
        console.log("🚀 App starting...");

        const token = getToken();

        if (!token) {
            console.error("❌ No token found");
            return;
        }

        const data = await api.getTasks();

        actions.setTasks(data.tasks || []);

        initSocket();
        render();

        console.log("✅ App ready");

    } catch (err) {
        console.error("❌ App init failed:", err);
    }
});