"use server";

import prisma from "@/lib/prisma";

export async function createTask(formData: FormData) {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const description = formData.get("description") as string;

  if (!username || !email || !description) {
    throw new Error("Все поля обязательны");
  }

  await prisma.task.create({
    data: {
      username,
      email,
      description,
      completed: false,
    },
  });
}
