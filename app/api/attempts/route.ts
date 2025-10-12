import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const object = await prisma.roomObject.findUnique({
      where: { id: data.objectId },
    });

    if (!object) return new Response("Object not found", { status: 404 });

    const isCorrect =
      data.answer.trim().toLowerCase() === object.correctAnswer.toLowerCase();

    const attempt = await prisma.attempt.create({
      data: {
        sessionId: data.sessionId,
        objectId: data.objectId,
        answer: data.answer,
        isCorrect,
        pointsAwarded: isCorrect ? object.points : 0,
      },
    });

    if (isCorrect) {
      await prisma.gameSession.update({
        where: { id: data.sessionId },
        data: { score: { increment: object.points } },
      });
    }

    return Response.json(attempt);
  } catch {
    return new Response("Error recording attempt", { status: 500 });
  }
}
