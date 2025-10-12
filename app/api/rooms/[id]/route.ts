import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const room = await prisma.escapeRoom.findUnique({
      where: { id: params.id },
      include: { objects: true },
    });
    if (!room) return new Response("Room not found", { status: 404 });
    return Response.json(room);
  } catch {
    return new Response("Error fetching room", { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();
    const room = await prisma.escapeRoom.update({
      where: { id: params.id },
      data,
    });
    return Response.json(room);
  } catch {
    return new Response("Error updating room", { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.escapeRoom.delete({ where: { id: params.id } });
    return new Response("Room deleted", { status: 200 });
  } catch {
    return new Response("Error deleting room", { status: 500 });
  }
}
