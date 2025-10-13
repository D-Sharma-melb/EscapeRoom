import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

// 🟢 GET all rooms (with objects)
export async function GET(req: NextRequest) {
  try {
    const rooms = await prisma.escapeRoom.findMany({
      include: { objects: true },
    });

    return NextResponse.json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json(
      { error: "Error fetching rooms" },
      { status: 500 }
    );
  }
}

// 🟢 POST create a new room
export async function POST(req: NextRequest) {
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

    return NextResponse.json(room);
  } catch (error) {
    console.error("Error creating room:", error);
    return NextResponse.json(
      { error: "Error creating room" },
      { status: 500 }
    );
  }
}
