import prisma from "@/lib/prisma";
import Link from "next/link";
import { Task } from "./generated/prisma";
import LoginModal from "./components/LoginModal";
import TaskList from "./components/TaskList";
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

  const tasks: Task[] = await prisma.$queryRawUnsafe(
    `SELECT * FROM "Task" ORDER BY LOWER("${sort}") ${order} LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}`,
  );

  const totalTasks = await prisma.task.count();
  const totalPages = Math.ceil(totalTasks / pageSize);

  return (
    <main className="max-w-3xl mx-auto p-8 space-y-6 text-gray-800">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">📋 Задачи</h1>
        <LoginModal />
      </header>

      <TaskForm />

      {/* Сортировка */}
      <div className="flex gap-2">
        {(["username", "email", "completed"] as (keyof Task)[]).map((field) => (
          <Link
            key={field}
            href={`/?page=1&sort=${field}&order=${order === "asc" ? "desc" : "asc"}`}
            className={`px-4 py-2 text-sm rounded-lg border transition ${
              sort === field
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white hover:bg-gray-100 border-gray-300"
            }`}
          >
            {field === "username"
              ? "Имя"
              : field === "email"
                ? "Email"
                : "Статус"}
            {sort === field && (order === "asc" ? " ↑" : " ↓")}
          </Link>
        ))}
      </div>

      {/* Список задач */}
      <TaskList tasks={tasks} />

      {/* Пагинация */}
      <div className="flex justify-center gap-2 mt-6">
        {page > 1 && (
          <Link
            href={`/?page=${page - 1}&sort=${sort}&order=${order}`}
            className="px-3 py-1 border rounded-lg hover:bg-gray-100"
          >
            ← Назад
          </Link>
        )}

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

        {page < totalPages && (
          <Link
            href={`/?page=${page + 1}&sort=${sort}&order=${order}`}
            className="px-3 py-1 border rounded-lg hover:bg-gray-100"
          >
            Вперёд →
          </Link>
        )}
      </div>
    </main>
  );
}
