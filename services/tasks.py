from services.db import get_db_connection

def get_all_tasks():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM tasks")
    tasks = cursor.fetchall()

    conn.close()

    return [dict(task) for task in tasks]


def mark_notified(task_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "UPDATE tasks SET notified = 1 WHERE id = ?",
        (task_id,)
    )

    conn.commit()
    conn.close()