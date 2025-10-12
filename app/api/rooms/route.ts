import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const rooms = await prisma.escapeRoom.findMany({
      include: { objects: true },
    });
    return Response.json(rooms);
  } catch (error) {
    return new Response("Error fetching rooms", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const room = await prisma.escapeRoom.create({
      data: {
        name: data.name,
        description: data.description,
        theme: data.theme,
        timer: data.timer,
        createdById: data.createdById,
      },
    });
    return Response.json(room);
  } catch (error) {
    return new Response("Error creating room", { status: 500 });
  }
}
