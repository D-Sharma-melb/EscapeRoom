import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// 🟢 GET all objects for a specific room
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const objects = await prisma.roomObject.findMany({
      where: { roomId: params.id },
    });

    return NextResponse.json(objects);
  } catch (error) {
    console.error("Error fetching objects:", error);
    return NextResponse.json(
      { error: "Error fetching objects" },
      { status: 500 }
    );
  }
}

// 🟢 POST create a new object in the room
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();

    const obj = await prisma.roomObject.create({
      data: {
        roomId: params.id,
        type: data.type,
        x: data.x,
        y: data.y,
        width: data.width,
        height: data.height,
        rotation: data.rotation || 0,
        question: data.question,
        correctAnswer: data.correctAnswer,
        hint: data.hint,
        points: data.points || 10,
      },
    });

    return NextResponse.json(obj);
  } catch (error) {
    console.error("Error creating object:", error);
    return NextResponse.json(
      { error: "Error creating object" },
      { status: 500 }
    );
  }
}
