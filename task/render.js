import { state } from "./state.js";
import { createTaskCard } from "./ui/tasksView.js";
import { renderNotifications } from "./ui/notificationsView.js";

export function render() {
    renderTasks();
    renderNotifications(state);
}

function renderTasks() {
    const taskList = document.getElementById("taskList");

    if (!taskList) return;

    taskList.innerHTML = "";

    state.tasks.forEach(task => {
        const card = createTaskCard(task);
        taskList.appendChild(card);
    });
}