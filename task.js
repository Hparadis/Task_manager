
const menuButton  = document.getElementById("menuButton")
const dropdownMenu = document.getElementById("dropdownButton")
menuButton.addEventListener("click",() =>{
    dropdownMenu.classList.toggle("hidden")
})

const createBtn = document.getElementById("createButton");
const taskList = document.getElementById("taskList");
createBtn.addEventListener("click", () => {
    createTask();
});
function createTask() {
    // container for each task
    const taskDiv = document.createElement("div");

    // checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    // input for text
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Write your task...";

    // append elements
    taskDiv.appendChild(checkbox);
    taskDiv.appendChild(input);

    // add to list
    taskList.appendChild(taskDiv);
}