import { NextResponse } from "next/server";
import { getRoomByCode, sendTextToRoom } from "@/lib/room";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const { content } = await request.json();

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    if (content.length > 10000) {
      return NextResponse.json(
        { error: "Content too long (max 10,000 characters)" },
        { status: 400 }
      );
    }

    const room = await getRoomByCode(code);

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    if (room.expired) {
      return NextResponse.json({ error: "Room expired" }, { status: 410 });
    }

    const item = await sendTextToRoom(room.id, content.trim());

    return NextResponse.json({ id: item.id, createdAt: item.createdAt });
  } catch (error) {
    console.error("Error sending text:", error);
    return NextResponse.json(
      { error: "Failed to send text" },
      { status: 500 }
    );
  }
}
