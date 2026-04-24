from flask import Blueprint, request, jsonify
import uuid
from werkzeug.security import check_password_hash
from services.db import get_db_connection
import time 

tokens = {
    "token_string":{
        "user_id":1,
        "expires_at":1234567789
    }
}

login_attempts ={}

login_bp = Blueprint("login", __name__)

@login_bp.route("/", methods=["POST"])
def login_user():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    ip = request.remote_addr
    current_time = time.time()

    if ip not in login_attempts:
        login_attempts[ip] = []
    login_attempts[ip] = [
        t for t in login_attempts[ip]
        if current_time - t < 60
    ]

    if len(login_attempts[ip]) >= 5:
        return jsonify({"error": "Too many attempts"}), 429
    
    login_attempts[ip].append(current_time)


    # 🔴 validate input
    if not email or not password:
        return jsonify({"error": "email and password required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    # 🔍 find user in database
    cursor.execute(
        "SELECT * FROM users WHERE email = ?",
        (email,)
    )

    user = cursor.fetchone()
    conn.close()

    # ❌ user not found
    if not user:
        return jsonify({"error": "invalid credentials"}), 401

    # 🔐 check password hash
    if not check_password_hash(user["password"], password):
        return jsonify({"error": "invalid credentials"}), 401

    # 🔑 create token
    token = str(uuid.uuid4())
    tokens[token] = {
        "user_id":user["id"],
        "expires_at":time.time() + 3600
        }
    return jsonify({
        "token": token,
        "message": "login successful"
    }), 200