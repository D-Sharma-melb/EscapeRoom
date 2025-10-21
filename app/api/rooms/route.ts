import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import logger from "@/lib/logger";

// GET all rooms (with objects)
export async function GET(req: NextRequest) {
  try {
    logger.info("Fetching all escape rooms");
    
    const rooms = await prisma.escapeRoom.findMany({
      include: { objects: true },
    });

    logger.info(`Successfully fetched ${rooms.length} rooms`);
    return NextResponse.json(rooms);
  } catch (error) {
    logger.error("Error fetching rooms", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: "Error fetching rooms" },
      { status: 500 }
    );
  }
}

// POST create a new room
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    logger.info("Creating new escape room", {
      name: data.name,
      theme: data.theme,
      createdById: data.createdById,
    });

    const room = await prisma.escapeRoom.create({
      data: {
        name: data.name,
        description: data.description,
        theme: data.theme,
        timer: data.timer,
        createdById: data.createdById,
      },
    });

    logger.info(`Successfully created room: ${room.id}`, { roomId: room.id });
    return NextResponse.json(room);
  } catch (error) {
    logger.error("Error creating room", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: "Error creating room" },
      { status: 500 }
    );
  }
}
