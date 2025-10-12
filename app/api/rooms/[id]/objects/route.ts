import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const objects = await prisma.roomObject.findMany({
      where: { roomId: params.id },
    });
    return Response.json(objects);
  } catch {
    return new Response("Error fetching objects", { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
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
    return Response.json(obj);
  } catch {
    return new Response("Error creating object", { status: 500 });
  }
}
