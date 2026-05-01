// /Users/paradis/Desktop/Task_manager/task/ui/tasksView.js
import { actions } from "../actions.js";


// ==========================
// 🧱 CREATE INPUT BOX (+)
// ==========================
export function createInputBox() {
    const taskList = document.getElementById("taskList");

    const container = document.createElement("div");
    container.className = "task-input-container";

    const input = document.createElement("textarea");
    input.placeholder = "Write your task...";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "Add";

    btn.addEventListener("click", () => {
        const value = input.value.trim();
        if (!value) return;

        // 🔥 EXACT SAME FLOW as before (just routed through actions)
        actions.createTask(value);

        input.value = "";
        container.remove();
    });
    btn.addEventListener("click", (e) => {
        e.preventDefault(); // 🔥 STOP reload
    
        const value = input.value.trim();
        if (!value) return;
    
        actions.createTask(value);
    
        input.value = "";
        container.remove();
    });

    container.append(input, btn);
    taskList.prepend(container);
}


// ==========================
// 🧱 TASK CARD
// ==========================
export function createTaskCard(task) {
    const div = document.createElement("div");
    div.className = "task-card";

    // 🔥 IMPORTANT (was in your old code)
    div.dataset.id = task.id;

    const input = document.createElement("textarea");
    input.value = task.title || "";

    const timeInput = document.createElement("input");
    timeInput.type = "datetime-local";
    timeInput.value = task.due_time || "";

    const bellBtn = document.createElement("button");
    bellBtn.type = "button";
    bellBtn.textContent = "🔔";

    let reminderOn = task.reminder || false;

    // 🔥 preserve visual state
    if (reminderOn) {
        bellBtn.style.background = "#facc15";
    }

    function autoSave() {
        actions.updateTask(task.id, input.value, timeInput.value, reminderOn);
    }

    // 🧠 same debounce logic
    let typingTimer;
    input.addEventListener("input", () => {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(autoSave, 600);
    });

    timeInput.addEventListener("change", autoSave);

    bellBtn.addEventListener("click", () => {
        reminderOn = !reminderOn;
        bellBtn.style.background = reminderOn ? "#facc15" : "transparent";
        autoSave();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.textContent = "-";

    deleteBtn.addEventListener("click", () => {
        actions.deleteTask(task.id);
    });

    div.append(input, timeInput, bellBtn, deleteBtn);

    return div;
}

export function addTaskToUI(task) {
    const list = document.getElementById("taskList");

    const card = createTaskCard(task);

    list.prepend(card); // 🔥 no re-render
}

export function removeTaskFromUI(id) {
    const el = document.querySelector(`[data-id="${id}"]`);
    if (el) el.remove();
}