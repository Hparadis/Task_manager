from flask import Flask, jsonify
from routes.tasks import task_bp
from routes.signup import signup_bp
from routes.login import login_bp
from flask_cors import CORS
from routes.auth import auth_bp
from flask_socketio import SocketIO
import threading
import os

app = Flask(__name__)
CORS(app)

socketio = SocketIO(app, cors_allowed_origins="*")

# ✅ Register routes
app.register_blueprint(task_bp, url_prefix="/tasks")
app.register_blueprint(signup_bp, url_prefix="/signup")
app.register_blueprint(login_bp, url_prefix="/login")
app.register_blueprint(auth_bp, url_prefix="/logout")

# ✅ Start scheduler ONLY once (avoid double run)
if os.environ.get("WERKZEUG_RUN_MAIN") == "true":
    from notification.scheduler import run_scheduler

    thread = threading.Thread(target=run_scheduler, args=(socketio,))
    thread.daemon = True
    thread.start()

# ✅ Start server
if __name__ == "__main__":
    socketio.run(app, debug=True)