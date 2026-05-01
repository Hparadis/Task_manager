// // /Users/paradis/Desktop/Task_manager/task/task.js
// const state = {
//     tasks: [],
//     notifications: []
// }

// state.notifications = JSON.parse(localStorage.getItem("notifications")) || [];
// window.addEventListener("DOMContentLoaded", () => {
//     renderNotifications();
//     loadTasks();
// });
// console.log("PAGE LOADED");
// // 🔔 Request notification permission
// if ("Notification" in window) {
//     Notification.requestPermission().then(permission => {
//         console.log("Notification permission:", permission);
//     });
// }
// const menuToggle = document.getElementById("menuToggle");
// const sidebar = document.getElementById("sidebar");

// menuToggle.addEventListener("click", () => {
//     sidebar.classList.toggle("active");
// });

// function render() {
//     renderTasks();
//     renderNotifications();
// }


// // everything  related to notification

// const socket = io("http://127.0.0.1:5000", {
//     transports: ["websocket", "polling"]
// });

// socket.on("connect", () => {
//     console.log("✅ Connected to server:", socket.id);
// });

// let lastNotification = null;



// function renderNotifications() {
//     const list = document.getElementById("notifList");
//     const count = document.getElementById("notifCount");

//     if (!list || !count) return;

//     list.innerHTML = "";

//     let unread = 0;

//     state.notifications.forEach(n => {
//         if (!n.read) unread++;

//         const div = document.createElement("div");
//         div.className = "notif-item " + (n.read ? "" : "unread");

//         div.innerHTML = `
//             <span>${n.title}</span>
//             <button onclick="markAsRead(${n.id})">✔</button>
//         `;

//         list.appendChild(div);
//     });

//     count.textContent = unread;
// }


// socket.on("task_due", (data) => {
//     console.log("📩 RECEIVED:", data.title);

//     const exists = state.notifications.find(n => n.title === data.title);
//     if (exists) return;

//     const newNotif = {
//         id: Date.now(),
//         title: data.title,
//         read: false
//     };

//     state.notifications.unshift(newNotif);

//     // ✅ CRITICAL
//     saveNotifications();

//     // ✅ ONLY update notifications UI (not full render)
//     renderNotifications();

//     triggerNotification(data.title);
// });




// function addNotification(title) {
//     const exists = state.notifications.find(n => n.title === title);
//     if (exists) return;

//     const notif = {
//         id: Date.now(),
//         title: title,
//         read: false
//     };

//     state.notifications.unshift(notif);

//     saveNotifications();
//     renderNotifications();
// }

// function markAsRead(id) {
//     const notif = state.notifications.find(n => n.id === id);
//     if (notif) {
//         notif.read = true;
//         saveNotifications();
//         renderNotifications();
//     }
// }

// function triggerNotification(title) {
//     console.log("📣 Creating notification for:", title);
//     if (Notification.permission === "granted") {
//         const notif = new Notification("Reminder", {
//             body: title,
//             icon: "https://cdn-icons-png.flaticon.com/512/1827/1827392.png"
//         });

//         notif.onclick = () => {
//             window.focus();
//         };
//     } else {
//         console.log("❌ Notification not allowed");
//     }
// }

// function saveNotifications() {
//     localStorage.setItem("notifications", JSON.stringify(state.notifications));
// }

// // everyting related to tasks

// function renderTasks() {

//     const taskList = document.getElementById("taskList");
//     taskList.innerHTML = "";

//     state.tasks.forEach(task => {
//         createTaskCard(task);
//     });
// }

// const createBtn = document.getElementById("createButton");
// const taskList = document.getElementById("taskList");

// // store tasks locally for engine


// // 🔑 TOKEN
// function getToken() {
//     return localStorage.getItem("token") || sessionStorage.getItem("token");
// }

// // ==========================
// // 🧱 CREATE INPUT BOX (+)
// // ==========================
// createBtn.addEventListener("click", () => {
//     createInputBox();
// });

// function createInputBox() {
//     const container = document.createElement("div");
//     container.className = "task-input-container";

//     const input = document.createElement("textarea");
//     input.placeholder = "Write your task...";

//     const btn = document.createElement("button");
//     btn.textContent = "Add";

//     btn.addEventListener("click", () => {
//         const value = input.value.trim();
//         if (!value) return;

//         // ✅ optimistic UI
//         const tempTask = {
//             id: Date.now(),
//             title: value
//         };


//         sendToBackend(value);

//         input.value = "";
//         container.remove(); // remove input after adding
//     });

//     container.appendChild(input);
//     container.appendChild(btn);

//     taskList.prepend(container);
// }

// // ==========================
// // 🧱 TASK CARD
// // ==========================
// function createTaskCard(task) {
//     const taskDiv = document.createElement("div");
//     taskDiv.className = "task-card";

//     taskDiv.dataset.id = task.id;
    
//     const input = document.createElement("textarea");
//     input.value = task.title || "";


//     const timeInput = document.createElement("input");
//     timeInput.type = "datetime-local";
//     timeInput.value = task.due_time || "";

//     const bellBtn = document.createElement("button");
//     bellBtn.textContent = "🔔";

//     let reminderOn = task.reminder || false;

//     if (reminderOn) {
//         bellBtn.style.background = "#facc15";
//     }

//     // 🔥 AUTO SAVE FUNCTION
//     function autoSave() {
//         console.log("🔥 AUTOSAVING:", {
//             id: task.id,
//             title: input.value,
//             due_time: timeInput.value,
//             reminder: reminderOn
//         });
    
//         updateTask(task.id, input.value, timeInput.value, reminderOn);
//     }

//     // 🧠 TITLE CHANGE → autosave (debounced)
//     let typingTimer;
//     input.addEventListener("input", () => {
//         clearTimeout(typingTimer);
//         typingTimer = setTimeout(autoSave, 600);
//     });

//     // ⏱ TIME CHANGE → autosave immediately
//     timeInput.addEventListener("change", () => {
//         autoSave();
//     });

//     // 🔔 BELL TOGGLE → autosave immediately
//     bellBtn.addEventListener("click", () => {
//         reminderOn = !reminderOn;
//         bellBtn.style.background = reminderOn ? "#facc15" : "transparent";
//         autoSave();
//     });

//     // ❌ DELETE
//     const deleteBtn = document.createElement("button");
//     deleteBtn.textContent = "-";

//     deleteBtn.addEventListener("click", () => {
//         deleteTask(task.id, taskDiv);
//     });

//     taskDiv.append(input, timeInput, bellBtn, deleteBtn);
//     // taskList.appendChild(taskDiv);

//     return taskDiv;
// }

// // ==========================
// // 🔥 CREATE (POST)
// // ==========================
// function sendToBackend(title) {
//     fetch("http://127.0.0.1:5000/tasks/", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": "Bearer " + getToken()
//         },
//         body: JSON.stringify({
//             title: title,
//             created_at: new Date().toISOString()
//         })
//     })
//     .then(res => {
//         if (!res.ok) throw new Error("Request failed");
//         return res.json();
//     })
//     .then(data => {
//         const newTask = data.task;

//         // ✅ update state
//         state.tasks.unshift(newTask);

//         // ✅ update UI ONLY for that task
//         const card = createTaskCard(newTask);
//         document.getElementById("taskList").prepend(card);

//         showMessage("Task created");
//     })
//     .catch(err => {
//         console.log("CREATE ERROR:", err);
//         showMessage("Failed to create task", true);
//     });
// }



// // ==========================
// // 🔄 LOAD ALL TASKS (ONLY S BUTTON)
// // ==========================
// const savedTasks = document.getElementById("savedTasks");

// savedTasks.addEventListener("click", loadTasks);

// function loadTasks() {
//     fetch("http://127.0.0.1:5000/tasks/all", {
//         headers: {
//             "Authorization": "Bearer " + getToken()
//         }
//     })
//     .then(res => res.json())
//     .then(data => {
//         if (!data.tasks) return;
    
//         state.tasks = data.tasks;
//         renderTasks();
//     })
//     .catch(() => {
//         showMessage("Failed to load tasks", true);
//     });
// }

// // ==========================
// // ✏️ UPDATE
// // ==========================
// function updateTask(id, title,due_time, reminder) {
//     fetch(`http://127.0.0.1:5000/tasks/${id}`, {
//         method: "PUT",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": "Bearer " + getToken()
//         },
//         body: JSON.stringify({ title ,due_time ,reminder})
//     })
//     .then(() => {

//         const task = state.tasks.find(t => t.id === id);
//         if (task) {
//             task.title = title;
//             task.due_time = due_time;
//             task.reminder = reminder;
//         }
//         showMessage("Task updated");
//     });
// }

// // ==========================
// // ❌ DELETE
// // ==========================
// function deleteTask(id) {
//     fetch(`http://127.0.0.1:5000/tasks/${id}`, {
//         method: "DELETE",
//         headers: {
//             "Authorization": "Bearer " + getToken()
//         }
//     })
//     .then(() => {
//         state.tasks = state.tasks.filter(t => t.id !== id);

//         const el = document.querySelector(`[data-id="${id}"]`);
//         if (el) el.remove();

//         showMessage("Task deleted");
//     });
// }

// // ==========================
// // 💬 MESSAGE
// // ==========================
// function showMessage(msg, isError = false) {
//     const box = document.getElementById("messageBox");

//     box.textContent = msg;
//     box.style.background = isError ? "#dc2626" : "#16a34a";

//     box.style.opacity = "1";
//     box.style.transform = "translateY(0px)";
//     box.style.display = "block";

//     // 🔥 reset animation cleanly
//     if (box._timer) {
//         clearTimeout(box._timer);
//     }

// }


