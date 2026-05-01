// api.js
import { getToken } from "./utils.js";

const BASE_URL = "http://127.0.0.1:5000";

export const api = {

    async getTasks() {
        const res = await fetch(`${BASE_URL}/tasks/all`, {
            headers: {
                Authorization: "Bearer " + getToken()
            }
        });

        if (!res.ok) throw new Error("Failed to fetch tasks");
        return res.json();
    },

    async createTask(title) {
        const res = await fetch(`${BASE_URL}/tasks/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + getToken()
            },
            body: JSON.stringify({
                title,
                created_at: new Date().toISOString()
            })
        });

        if (!res.ok) throw new Error("Failed to create task");
        return res.json();
    },

    async updateTask(id, data) {
        await fetch(`${BASE_URL}/tasks/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + getToken()
            },
            body: JSON.stringify(data)
        });
    },

    async deleteTask(id) {
        await fetch(`${BASE_URL}/tasks/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + getToken()
            }
        });
    }
};