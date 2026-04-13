const form = document.getElementById("signupForm");

form.addEventListener("submit", function(event) {
    event.preventDefault(); // stop page refresh

    // get values
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // create data object
    const data = {
        name: name,
        email: email,
        password: password
    };

    // send to backend
    fetch("http://127.0.0.1:5000/signup/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
        window.location.href = "task.html"
    })
    .catch(error => {
        console.error("Error:", error);
    });
});
