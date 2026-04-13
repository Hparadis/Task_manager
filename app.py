from flask import Flask,jsonify
from routes.tasks import task_bp
from routes.signup import signup_bp
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

app.register_blueprint(task_bp,url_prefix="/tasks")
app.register_blueprint(signup_bp,url_prefix="/signup")
if __name__ == "__main__":
    app.run(debug=True)