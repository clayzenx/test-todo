"use client";
import { useState, FormEvent, useContext } from "react";
import { AdminContext } from "../context/AdminContext";

export default function LoginModal() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { setToken } = useContext(AdminContext);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Ошибка входа");

      setToken(data.token);

      setOpen(false);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Войти
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-lg w-80 flex flex-col gap-3"
          >
            <h2 className="text-xl font-bold">Вход для администратора</h2>

            <input
              name="username"
              placeholder="Логин"
              required
              className="border px-3 py-2 rounded"
            />
            <input
              type="password"
              name="password"
              placeholder="Пароль"
              required
              className="border px-3 py-2 rounded"
            />

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {loading ? "Вход..." : "Войти"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-gray-600 text-sm"
            >
              Отмена
            </button>
          </form>
        </div>
      )}
    </>
  );
}
