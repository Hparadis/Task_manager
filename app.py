from flask import Flask,jsonify
from routes.tasks import task_bp
from routes.signup import signup_bp
from routes.login import login_bp
from flask_cors import CORS
from routes.auth import auth_bp
app = Flask(__name__)
CORS(app)

app.register_blueprint(task_bp,url_prefix="/tasks")
app.register_blueprint(signup_bp,url_prefix="/signup")
app.register_blueprint(login_bp,url_prefix="/login")
app.register_blueprint(auth_bp,url_prefix="/logout")
if __name__ == "__main__":
    app.run(debug=True)