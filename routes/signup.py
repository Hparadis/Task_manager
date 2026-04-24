#/Users/paradis/Desktop/Task_manager/routes/signup.py
from flask import Blueprint, jsonify, request
from werkzeug.security import generate_password_hash
from services.db import get_db_connection
import uuid
from routes.login import tokens  
import time

signup_bp = Blueprint("signup", __name__)

@signup_bp.route("/", methods=["POST"])
def create_user():
    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"error": "all fields required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    # hash password
    hashed_password = generate_password_hash(password, method="pbkdf2:sha256")

    try:
        cursor.execute("""
            INSERT INTO users (name, email, password)
            VALUES (?, ?, ?)
        """, (name, email, hashed_password))

        conn.commit()

        # 🔥 get created user id
        user_id = cursor.lastrowid

        # 🔥 create token (AUTO LOGIN)
        token = str(uuid.uuid4())
        tokens[token] = {
            "user_id": user_id,
            "expires_at": time.time() + 3600 
        }

        conn.close()

        return jsonify({
            "message": "user created",
            "token": token  
        }), 201

    except Exception as e:
        conn.close()
        return jsonify({"error": "email already exists"}), 400