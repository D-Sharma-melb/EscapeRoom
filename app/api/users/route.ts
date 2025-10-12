// CRUD for users (create, list)

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return Response.json(users);
  } catch (error) {
    return new Response("Error fetching users", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const user = await prisma.user.create({
      data: {
        username: data.username,
        password: data.password,
        role: data.role || "PLAYER",
      },
    });
    return Response.json(user);
  } catch (error) {
    return new Response("Error creating user", { status: 500 });
  }
}
