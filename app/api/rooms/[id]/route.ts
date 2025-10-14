import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// 🟢 GET a single room by ID (including objects)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const room = await prisma.escapeRoom.findUnique({
      where: { id },
      include: { objects: true },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json(room);
  } catch (error) {
    console.error("Error fetching room:", error);
    return NextResponse.json(
      { error: "Error fetching room" },
      { status: 500 }
    );
  }
}

// 🟡 PUT update a room by ID
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await req.json();

    const room = await prisma.escapeRoom.update({
      where: { id },
      data,
    });

    return NextResponse.json(room);
  } catch (error) {
    console.error("Error updating room:", error);
    return NextResponse.json(
      { error: "Error updating room" },
      { status: 500 }
    );
  }
}

// 🔴 DELETE a room by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.escapeRoom.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Room deleted successfully" });
  } catch (error) {
    console.error("Error deleting room:", error);
    return NextResponse.json(
      { error: "Error deleting room" },
      { status: 500 }
    );
  }
}
