import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  let payload: any;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  if (payload.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { description, completed } = await req.json();

  const task = await prisma.task.update({
    where: { id: Number(params.id) },
    data: { description, completed },
  });

  return NextResponse.json(task);
}
