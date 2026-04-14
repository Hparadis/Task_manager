
const createBtn = document.getElementById("createButton")
const taskList = document.getElementById("taskList");

createBtn.addEventListener("click", () => {
    createTask();
});


// CREATE TASK INPUT
function createTask() {
    const taskDiv = document.createElement("div");

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Write your task...";

    // 🔥 SEND TO BACKEND WHEN ENTER PRESSED
    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            sendToBackend(input.value);
            input.value = ""; // clear after sending
        }
    });

    taskDiv.appendChild(input);
    taskList.appendChild(taskDiv);
}


// 🔥 BACKEND CONNECTION (POST)
function sendToBackend(title) {
    fetch("http://127.0.0.1:5000/tasks/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title: title })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Task created:", data);
    })
    .catch(error => {
        console.error(error);
    });
}

// we are going to display all tasks user creted with an edit button to update or delete
const savedTasks = document.getElementById("savedTasks")
savedTasks.addEventListener("click", ()=>{
    savingTasks()
 })
 function savingTasks() {
    fetch("http://127.0.0.1:5000/tasks/all", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        taskList.innerHTML = "";

        data.tasks.forEach(task => {
            const taskDiv = document.createElement("div");

            // input (editable)
            const input = document.createElement("input");
            input.type = "text";
            input.value = task.title;

            // UPDATE button
            const updateBtn = document.createElement("button");
            updateBtn.textContent = "U";

            updateBtn.addEventListener("click", () => {
                updateTask(task.id, input.value);
            });

            // DELETE button
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "-";

            deleteBtn.addEventListener("click", () => {
                deleteTask(task.id);
                taskDiv.remove(); // remove from UI
            });

            taskDiv.appendChild(input);
            taskDiv.appendChild(updateBtn);
            taskDiv.appendChild(deleteBtn);

            taskList.appendChild(taskDiv);
        });
    })
    .catch(error => {
        console.error(error);
    });
}

function updateTask(id, title) {
    fetch(`http://127.0.0.1:5000/tasks/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title: title })
    })
    .then(res => res.json())
    .then(data => {
        console.log("Updated:", data);
        savingTasks();
    });
}

function deleteTask(id) {
    fetch(`http://127.0.0.1:5000/tasks/${id}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(data => {
        console.log("Deleted:", data);
        savingTasks();
    });
}