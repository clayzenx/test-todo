import prisma from "@/lib/prisma";
import Link from "next/link";
import { Task } from "./generated/prisma";
import TaskForm from "./components/TaskForm";

type SearchParams = {
  page?: string;
  sort?: keyof Task;
  order?: "asc" | "desc";
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const page = parseInt(params.page || "1", 10);
  const sort: keyof Task = params.sort || "username";
  const order: "asc" | "desc" = params.order === "desc" ? "desc" : "asc";

  const pageSize = 3;

  const tasks: Task[] = await prisma.task.findMany({
    orderBy: { [sort]: order },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const total = await prisma.task.count();
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="p-8 max-w-3xl mx-auto text-gray-800">
      <h1 className="text-3xl font-bold mb-8">📋 Задачи</h1>

      <TaskForm />

      {/* Сортировка */}
      <div className="mb-8 flex gap-2">
        {(["username", "email", "completed"] as (keyof Task)[]).map((field) => (
          <Link
            key={field}
            href={`/?page=1&sort=${field}&order=${order === "asc" ? "desc" : "asc"}`}
            className={`px-4 py-2 rounded-lg border text-sm transition ${
              sort === field
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white hover:bg-gray-100 border-gray-300"
            }`}
          >
            {field}
            {sort === field && (order === "asc" ? " ↑" : " ↓")}
          </Link>
        ))}
      </div>

      {/* Список задач */}
      <ul className="mb-8 space-y-4">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="p-6 bg-white border border-gray-300 rounded-xl shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-lg">{task.username}</span>
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  task.completed
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {task.completed ? "Выполнена" : "Не выполнена"}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-2">{task.email}</p>
            <p className="text-gray-700">{task.description}</p>
          </li>
        ))}
      </ul>

      {/* Пагинация */}
      <div className="flex justify-center items-center gap-2">
        {/* Назад */}
        {page > 1 && (
          <Link
            href={`/?page=${page - 1}&sort=${sort}&order=${order}`}
            className="px-3 py-1 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
          >
            ← Назад
          </Link>
        )}

        {/* Номера страниц */}
        {Array.from({ length: totalPages }).map((_, i) => (
          <Link
            key={i}
            href={`/?page=${i + 1}&sort=${sort}&order=${order}`}
            className={`px-3 py-1 border rounded-lg text-sm ${
              page === i + 1
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white hover:bg-gray-100 border-gray-300"
            }`}
          >
            {i + 1}
          </Link>
        ))}

        {/* Вперёд */}
        {page < totalPages && (
          <Link
            href={`/?page=${page + 1}&sort=${sort}&order=${order}`}
            className="px-3 py-1 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
          >
            Вперёд →
          </Link>
        )}
      </div>
    </div>
  );
}
