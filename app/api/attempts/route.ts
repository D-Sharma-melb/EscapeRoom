import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// POST - Record a player's attempt and update score if correct
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Find the object by ID
    const object = await prisma.roomObject.findUnique({
      where: { id: data.objectId },
    });

    if (!object) {
      return NextResponse.json({ error: "Object not found" }, { status: 404 });
    }

    // Check if answer is correct
    const isCorrect =
      data.answer.trim().toLowerCase() ===
      object.correctAnswer.trim().toLowerCase();

    //  Record attempt
    const attempt = await prisma.attempt.create({
      data: {
        sessionId: data.sessionId,
        objectId: data.objectId,
        answer: data.answer,
        isCorrect,
        pointsAwarded: isCorrect ? object.points : 0,
      },
    });

    // Update score if answer is correct
    if (isCorrect) {
      await prisma.gameSession.update({
        where: { id: data.sessionId },
        data: { score: { increment: object.points } },
      });
    }

    return NextResponse.json(attempt);
  } catch (error) {
    console.error("Error recording attempt:", error);
    return NextResponse.json(
      { error: "Error recording attempt" },
      { status: 500 }
    );
  }
}
