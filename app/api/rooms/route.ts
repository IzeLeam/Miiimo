import { NextResponse } from "next/server";
import { createRoom } from "@/lib/room";

export async function POST() {
  try {
    const room = await createRoom();
    return NextResponse.json({ code: room.code });
  } catch (error) {
    console.error("Error creating room:", error);
    return NextResponse.json(
      { error: "Failed to create room" },
      { status: 500 }
    );
  }
}
