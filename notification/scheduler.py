# notification/scheduler.py

import time
from datetime import datetime
from services.tasks import get_all_tasks, mark_notified

def run_scheduler(socketio):
    print("🧠 Scheduler started...")
    while True:
        tasks = get_all_tasks()
        now = datetime.now()

        print("🔁 Checking tasks...")

        for task in tasks:
            print("TASK ID:", task["id"], "NOTIFIED:", task.get("notified"))
            
            if not task.get("due_time") or not task.get("reminder"):
                continue

            if int(task.get("notified") or 0) == 1:
                continue

            due = datetime.fromisoformat(task["due_time"])

            if now >= due:
                print("🔔 TRIGGERED:", task["title"])

                socketio.emit("task_due", {
                    "title": task["title"]
                })

                mark_notified(task["id"])

            print("NOW:", now)
            print("DUE:", due)

        time.sleep(5)
