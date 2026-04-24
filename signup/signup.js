window.addEventListener("beforeunload", () => {
    console.log("PAGE IS RELOADING ⚠️");
});
const form = document.getElementById("signupForm");

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!name || !email || !password) {
        showMessage("All fields required", true);
        return;
    }

    fetch("http://127.0.0.1:5000/signup/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
    })
    .then(res => res.json())
    .then(result => {
        if (result.error) {
            showMessage(result.error, true);
            return;
        }

        // ✅ save token
        localStorage.setItem("token", result.token);

        showMessage("Account created!");

        // ✅ redirect safely (no flicker issue)
        window.location.href = "../task/task.html";
    })
    .catch(() => {
        showMessage("Signup failed", true);
    });
});

// ==========================
// 💬 MESSAGE
// ==========================
function showMessage(msg, isError = false) {
    const box = document.getElementById("messageBox");

    box.textContent = msg;
    box.style.background = isError ? "#dc2626" : "#16a34a";
    box.style.color = "white";
    box.style.padding = "10px";
    box.style.marginTop = "10px";

    box.classList.add("show");

    setTimeout(() => {
        box.classList.remove("show");
    }, 2000);
}