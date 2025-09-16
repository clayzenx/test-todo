"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { AdminContext } from "../context/AdminContext";
import { Task } from "../generated/prisma";

export default function TaskList({ tasks }: { tasks: Task[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<number | null>(null);
  const [values, setValues] = useState({ description: "", completed: false });

  const { isAdmin } = useContext(AdminContext);

  async function saveTask(id: number) {
    await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setEditing(null);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`p-4 border rounded-lg ${
            task.completed ? "bg-green-50" : "bg-white"
          }`}
        >
          {editing === task.id ? (
            <div className="flex flex-col gap-2">
              <textarea
                value={values.description}
                onChange={(e) =>
                  setValues({ ...values, description: e.target.value })
                }
                className="border px-2 py-1 rounded w-full"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={values.completed}
                  onChange={(e) =>
                    setValues({ ...values, completed: e.target.checked })
                  }
                />
                Выполнено
              </label>
              <button
                onClick={() => saveTask(task.id)}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Сохранить
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <p>
                <strong>{task.username}</strong> ({task.email})
              </p>
              <p className={task.completed ? "line-through" : ""}>
                {task.description}
              </p>
              {task.completed && (
                <span className="text-green-600">✅ Выполнено</span>
              )}
              {isAdmin && (
                <button
                  onClick={() => {
                    setEditing(task.id);
                    setValues({
                      description: task.description,
                      completed: task.completed,
                    });
                  }}
                  className="self-start mt-1 px-2 py-1 bg-yellow-500 text-white rounded"
                >
                  Редактировать
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
