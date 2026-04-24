from flask import Blueprint,jsonify,request
from routes.tasks import require_auth
from routes.login import tokens
auth_bp = Blueprint("auth_bp",__name__)

@auth_bp.route("/logout", methods=["POST"])
@require_auth
def logout():
    auth = request.headers.get("Authorization")
    token = auth.replace("Bearer ", "")

    # remove token
    if token in tokens:
        del tokens[token]

    return jsonify({"message": "logged out"}), 200