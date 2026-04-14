from flask import Blueprint,jsonify,request

task_bp = Blueprint("tasks",__name__)
tasks = []
@task_bp.route("/",methods=["POST"])
def create_task():
    data = request.get_json()
    title = data.get("title")
    if not title :
        return jsonify({
            "errors":"enter something "
        }),400
    task ={
        "id":len(tasks)+1,
        "title":title,
        "status":"Created"
    }
    tasks.append(task)
    return jsonify({
      "message":"task created successfully",
      "task":task
    }),201
@task_bp.route("/",methods=["GET"])
def read_task():
    if not tasks:
        return jsonify({
        "tasks":tasks
        })
    else :
        return jsonify({
        "errors":"there aren't any tasks yet ,create one !!!"
        }),400

@task_bp.route("/<int:id>",methods=["PUT"])
def update_task(id):
     data = request.get_json()
     for  task in tasks :
         if task["id"] == id :
            task["title"] = data.get("title",task["title"])
            task["status"] = data.get("status",task["status"])

            return jsonify({
            "message":"task updated successfullly",
            "task":task
            }),200
     return jsonify({
        "error":"task not found"
    }),404
@task_bp.route("/<int:id>",methods=["DELETE"])
def delete_task(id):
    for task in tasks :
        if task["id"] == id:
             tasks.remove(task)
        return jsonify({
        "message":"task deleted successfully"
        })
    return jsonify({
        "error":"task not found"
    }),404
@task_bp.route("/all",methods=["GET"])
def get_all_tasks():
    return jsonify({
        "tasks":tasks
    })
