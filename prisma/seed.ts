import { PrismaClient, Prisma } from "../app/generated/prisma";

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
}

main();
