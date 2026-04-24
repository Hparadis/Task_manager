console.log("PAGE LOADED");

const createBtn = document.getElementById("createButton");
const taskList = document.getElementById("taskList");

// 🔑 TOKEN
function getToken() {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
}

// ==========================
// 🧱 CREATE INPUT BOX (+)
// ==========================
createBtn.addEventListener("click", () => {
    createInputBox();
});

function createInputBox() {
    const container = document.createElement("div");
    container.className = "task-input-container";

    const input = document.createElement("textarea");
    input.placeholder = "Write your task...";

    const btn = document.createElement("button");
    btn.textContent = "Add";

    btn.addEventListener("click", () => {
        const value = input.value.trim();
        if (!value) return;

        // ✅ optimistic UI
        const tempTask = {
            id: Date.now(),
            title: value
        };

        const card = createTaskCard(tempTask);

        sendToBackend(value);

        input.value = "";
        container.remove(); // remove input after adding
    });

    container.appendChild(input);
    container.appendChild(btn);

    taskList.prepend(container);
}

// ==========================
// 🧱 TASK CARD
// ==========================
function createTaskCard(task) {
    const taskDiv = document.createElement("div");
    taskDiv.className = "task-card";

    const input = document.createElement("textarea");
    input.value = task.title || "";

    const timeInput = document.createElement("input");
    timeInput.type = "datetime-local";
    timeInput.value = task.due_time || "";

    const bellBtn = document.createElement("button");
    bellBtn.textContent = "🔔";

    let reminderOn = task.reminder || false;

    if (reminderOn) {
        bellBtn.style.background = "#facc15";
    }

    bellBtn.addEventListener("click", () => {
        reminderOn = !reminderOn;
        bellBtn.style.background = reminderOn ? "#facc15" : "transparent";
    });

    const updateBtn = document.createElement("button");
    updateBtn.textContent = "U";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "-";

    updateBtn.addEventListener("click", () => {
        updateTask(task.id, input.value, timeInput.value, reminderOn);
    });

    deleteBtn.addEventListener("click", () => {
        deleteTask(task.id, taskDiv);
    });

    taskDiv.append(input, timeInput, bellBtn, updateBtn, deleteBtn);
    taskList.appendChild(taskDiv);

    return taskDiv;
}

// ==========================
// 🔥 CREATE (POST)
// ==========================
function sendToBackend(title,due_time, reminder) {
    fetch("http://127.0.0.1:5000/tasks/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getToken()
        },
        body: JSON.stringify({
            title: title,
            due_time: due_time,
            reminder: reminder,
            created_at: new Date().toISOString()
        })
    })
    .then(res => res.json())
    .then(() => {
        showMessage("Task created");
    })
    .catch(() => {
        showMessage("Failed to create task", true);
    });
}

// ==========================
// 🔄 LOAD ALL TASKS (ONLY S BUTTON)
// ==========================
const savedTasks = document.getElementById("savedTasks");

savedTasks.addEventListener("click", loadTasks);

function loadTasks() {
    fetch("http://127.0.0.1:5000/tasks/all", {
        headers: {
            "Authorization": "Bearer " + getToken()
        }
    })
    .then(res => res.json())
    .then(data => {
        taskList.innerHTML = "";

        data.tasks.forEach(task => {
            createTaskCard(task);
        });
    });
}

// ==========================
// ✏️ UPDATE
// ==========================
function updateTask(id, title,due_time, reminder) {
    fetch(`http://127.0.0.1:5000/tasks/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getToken()
        },
        body: JSON.stringify({ title ,due_time ,reminder})
    })
    .then(() => {
        showMessage("Task updated");
    });
}

// ==========================
// ❌ DELETE
// ==========================
function deleteTask(id) {
    fetch(`http://127.0.0.1:5000/tasks/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + getToken()
        }
    })
    .then(() => {
        showMessage("Task deleted");
    });
}

// ==========================
// 💬 MESSAGE
// ==========================
function showMessage(msg, isError = false) {
    const box = document.getElementById("messageBox");

    box.textContent = msg;
    box.style.background = isError ? "#dc2626" : "#16a34a";

    box.classList.add("show");

    setTimeout(() => {
        box.classList.remove("show");
    }, 2000);
}