import { NextResponse } from "next/server";
import {
  getRoomByCode,
  getLatestUnconsumedItem,
  markItemAsConsumed,
} from "@/lib/room";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const url = new URL(request.url);
    const consume = url.searchParams.get("consume") === "true";

    const room = await getRoomByCode(code);

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    if (room.expired) {
      return NextResponse.json({ error: "Room expired" }, { status: 410 });
    }

    const item = await getLatestUnconsumedItem(room.id);

    if (!item) {
      return NextResponse.json({ item: null });
    }

    if (consume) {
      await markItemAsConsumed(item.id);
    }

    return NextResponse.json({
      item: {
        id: item.id,
        content: item.content,
        createdAt: item.createdAt,
      },
    });
  } catch (error) {
    console.error("Error receiving text:", error);
    return NextResponse.json(
      { error: "Failed to receive text" },
      { status: 500 }
    );
  }
}
