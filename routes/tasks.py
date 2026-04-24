from functools import wraps
from flask import Blueprint, jsonify, request
from services.db import get_db_connection
from routes.login import tokens
import time

task_bp = Blueprint("tasks", __name__)

def require_auth(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        auth = request.headers.get("Authorization")

        if not auth:
            return jsonify({"error": "unauthorized"}), 401

        token = auth.replace("Bearer ", "")
        token_data = tokens.get(token)

        if not token_data:
            return jsonify({"error": "unauthorized"}), 401

        # check expiration
        if token_data["expires_at"] < time.time():
            del tokens[token]
            return jsonify({"error": "token expired"}), 401

        # attach user_id to request
        request.user_id = token_data["user_id"]

        return f(*args, **kwargs)

    return wrapper


# 🔐 Get user from token
def get_user_from_token():
    auth = request.headers.get("Authorization")

    if not auth:
        return None

    token = auth.replace("Bearer ", "")

    token_data = tokens.get(token)
    if not token_data:
        return None
    if token_data["expires_at"] < time.time():
        del tokens[token]
        return None
    return token_data["user_id"]



# ➕ CREATE TASK
@task_bp.route("/", methods=["POST"])
@require_auth
def create_task():
    data = request.get_json()
    title = data.get("title")
    created_at = data.get("created_at")
    due_time = data.get("due_time")
    reminder = data.get("reminder",False)

    user_id = request.user_id

    if not title:
        return jsonify({"error": "enter something"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO tasks (title, user_id,created_at,due_time,reminder) VALUES (?, ?, ?, ?, ?)",
        (title, user_id,created_at,due_time,int(reminder))
    )

    conn.commit()
    conn.close()

    return jsonify({"message": "task created successfully"}), 201


# ✏️ UPDATE TASK (ONLY OWNER)
@task_bp.route("/<int:id>", methods=["PUT"])
@require_auth
def update_task(id):
    data = request.get_json()
    title = data.get("title")

    user_id = request.user_id

    conn = get_db_connection()
    cursor = conn.cursor()

    # 🔒 Ensure user owns the task
    cursor.execute(
        "SELECT * FROM tasks WHERE id = ? AND user_id = ?",
        (id, user_id)
    )
    task = cursor.fetchone()

    if not task:
        conn.close()
        return jsonify({"error": "task not found or not allowed"}), 404

    # ✅ Update
    cursor.execute(
        "UPDATE tasks SET title = ? WHERE id = ? AND user_id = ?",
        (title, id,request.user_id)
    )

    conn.commit()
    conn.close()

    return jsonify({"message": "task updated successfully"}), 200


# ❌ DELETE TASK (ONLY OWNER)
@task_bp.route("/<int:id>", methods=["DELETE"])
@require_auth
def delete_task(id):
    
    user_id = request.user_id

    conn = get_db_connection()
    cursor = conn.cursor()

    # 🔒 Ensure ownership
    cursor.execute(
        "SELECT * FROM tasks WHERE id = ? AND user_id = ?",
        (id, user_id)
    )
    task = cursor.fetchone()

    if not task:
        conn.close()
        return jsonify({"error": "task not found or not allowed"}), 404

    # ✅ Delete
    cursor.execute(
        "DELETE FROM tasks WHERE id = ? AND user_id = ?",
        (id,request.user_id)
    )

    conn.commit()
    conn.close()

    return jsonify({"message": "task deleted successfully"}), 200


# 📥 GET USER TASKS
@task_bp.route("/all", methods=["GET"])
@require_auth
def get_user_tasks():

    user_id = request.user_id

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM tasks WHERE user_id = ?",
        (user_id,)
    )

    tasks = cursor.fetchall()
    conn.close()

    return jsonify({
        "tasks": [dict(task) for task in tasks],
    })
