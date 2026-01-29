import { NextResponse } from "next/server";
import { getRoomByCode } from "@/lib/room";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const room = await getRoomByCode(code);

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    if (room.expired) {
      return NextResponse.json({ error: "Room expired" }, { status: 410 });
    }

    return NextResponse.json({
      id: room.id,
      code: room.code,
      expiresAt: room.expiresAt,
      serverNow: new Date(),
    });
  } catch (error) {
    console.error("Error fetching room:", error);
    return NextResponse.json(
      { error: "Failed to fetch room" },
      { status: 500 }
    );
  }
}
