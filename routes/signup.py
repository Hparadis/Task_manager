from flask import Blueprint,jsonify,request

users =[]
signup_bp = Blueprint("signup",__name__)
# creating a new user 
@signup_bp.route("/",methods=["POST"])
def create_user():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    if not name or not email or not password :
        return jsonify({
            "errors":"all fields are required"
        }),400
    user ={
        "id": len(users) + 1 ,
        "name": name,
        "email":email,
        "password":password
    }
    users.append(user)
    return jsonify({
        "message":"user created successfully",
        "user":user
    }),201