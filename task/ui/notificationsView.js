export function renderNotifications(state) {
    const list = document.getElementById("notifList");
    const count = document.getElementById("notifCount");

    if (!list || !count) return;

    list.innerHTML = "";

    let unread = 0;

    state.notifications.forEach(n => {
        if (!n.read) unread++;

        const div = document.createElement("div");
        div.className = "notif-item " + (n.read ? "" : "unread");

        const span = document.createElement("span");
        span.textContent = n.title;

        const btn = document.createElement("button");
        btn.textContent = "✔";

        btn.addEventListener("click", () => {
            n.read = true;

            localStorage.setItem("notifications", JSON.stringify(state.notifications));

            renderNotifications(state);
        });

        div.append(span, btn);
        list.appendChild(div);
    });

    count.textContent = unread;
}

export function addNotificationToUI(notif) {
    const list = document.getElementById("notifList");
    const count = document.getElementById("notifCount");

    const div = document.createElement("div");
    div.className = "notif-item unread";

    div.innerHTML = `
        <span>${notif.title}</span>
        <button>✔</button>
    `;

    list.prepend(div);

    // update count manually
    count.textContent = parseInt(count.textContent || "0") + 1;
}

export function showNotificationToast(notif) {
    const container = document.getElementById("notificationToasts");

    const div = document.createElement("div");
    div.className = "notif-toast";

    div.innerHTML = `
        <span>${notif.title}</span>
        <button class="close-btn">✖</button>
    `;

    // ❌ click = move to sidebar
    div.querySelector(".close-btn").addEventListener("click", () => {
        div.remove();

        // 👉 NOW add to real notifications
        import("../actions.js").then(({ actions }) => {
            actions.addNotification(notif);
        });
    });

    container.appendChild(div);

}