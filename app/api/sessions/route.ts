import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// 🟢 GET - Fetch all game sessions (with related player & room)
export async function GET(req: NextRequest) {
  try {
    const sessions = await prisma.gameSession.findMany({
      include: {
        player: true,
        room: true,
      },
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json(
      { error: "Error fetching sessions" },
      { status: 500 }
    );
  }
}

// 🟢 POST - Create a new game session
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const session = await prisma.gameSession.create({
      data: {
        roomId: data.roomId,
        playerId: data.playerId,
      },
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json(
      { error: "Error creating session" },
      { status: 500 }
    );
  }
}
