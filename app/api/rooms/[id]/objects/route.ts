import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// 🟢 GET all objects for a specific room
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const objects = await prisma.roomObject.findMany({
      where: { roomId: id },
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await req.json();
    
    console.log(`📝 Creating object in room ${id}:`, {
      type: data.type,
      question: data.question,
      answer: data.correctAnswer,
      points: data.points
    });

    const obj = await prisma.roomObject.create({
      data: {
        roomId: id,
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

    console.log(`✅ Object created successfully with ID: ${obj.id}`);
    return NextResponse.json(obj);
  } catch (error) {
    console.error("❌ Error creating object:", error);
    return NextResponse.json(
      { error: "Error creating object", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
