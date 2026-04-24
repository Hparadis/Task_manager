const form = document.getElementById("loginForm");


form.addEventListener("submit", function(event) {
    event.preventDefault();
    event.stopPropagation();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const remember = document.getElementById("rememberMe").checked;

    const data = { email, password };

    fetch("http://127.0.0.1:5000/login/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.error || result.errors){
            showMessage(result.error || result.errors, true);
            return;
        }
        showMessage("Login successful");

        // ✅ NOW result exists
        if (remember) {
            localStorage.setItem("token", result.token);
        } else {
            sessionStorage.setItem("token", result.token);
        }

        window.location.href = "../task/task.html";
    })
    .catch(error => {
        console.error("Error:", error);
    });
    return false;
});

function showMessage(msg, isError = false) {
    const box = document.getElementById("messageBox");
    box.textContent = msg;
    box.style.background = isError ? "#dc2626" : "#16a34a";

    box.classList.add("show");

    setTimeout(() => {
        box.classList.remove("show");
    }, 2500);
}