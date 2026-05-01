export const state = {
    tasks: [],
    notifications: JSON.parse(localStorage.getItem("notifications")) || []
}