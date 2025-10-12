import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const sessions = await prisma.gameSession.findMany({
      include: { player: true, room: true },
    });
    return Response.json(sessions);
  } catch {
    return new Response("Error fetching sessions", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const session = await prisma.gameSession.create({
      data: {
        roomId: data.roomId,
        playerId: data.playerId,
      },
    });
    return Response.json(session);
  } catch {
    return new Response("Error creating session", { status: 500 });
  }
}
