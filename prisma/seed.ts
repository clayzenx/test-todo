import { PrismaClient, Prisma } from "../app/generated/prisma";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const userData: Prisma.TaskCreateInput[] = [
  {
    completed: false,
    username: "Valera",
    email: "valik111@mail.ru",
    description: "Набрать пацанам",
  },
  {
    completed: false,
    username: "Stepan",
    email: "stepup13@mail.ru",
    description: "Заказать цветочки",
  },
  {
    completed: false,
    username: "Natali",
    email: "natali_love3@mail.ru",
    description: "Купить билеты в Турацию",
  },
  {
    completed: false,
    username: "den4ik",
    email: "den4ik_headshot@mail.ru",
    description: "Сгонять в компы",
  },
  {
    completed: false,
    username: "KateMoss",
    email: "honeybee@mail.ru",
    description: "Ноготочки в 9",
  },
  {
    completed: false,
    username: "KateMoss",
    email: "honeybee@mail.ru",
    description: "Кафешка с подружкой",
  },
];

export async function main() {
  for (const u of userData) {
    await prisma.task.create({ data: u });
  }

  const username = "admin";
  const password = "123";

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { username },
    update: {},
    create: {
      username,
      passwordHash,
      role: "admin",
    },
  });

  console.log(`Admin user created: login=${username} / password=${password}`);
}

main();
