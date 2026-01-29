import { prisma } from "./prisma";
import { generateRoomCode, getRoomExpiryDate, isRoomExpired } from "./utils";

export async function createRoom() {
  const code = generateRoomCode();
  const expiresAt = getRoomExpiryDate(10);

  const room = await prisma.room.create({
    data: {
      code,
      expiresAt,
    },
  });

  return room;
}

export async function getRoomByCode(code: string) {
  const room = await prisma.room.findUnique({
    where: { code: code.toUpperCase() },
  });

  if (!room) return null;
  if (isRoomExpired(room.expiresAt)) return { ...room, expired: true };

  return { ...room, expired: false };
}

export async function sendTextToRoom(roomId: string, content: string) {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
  });

  if (!room || isRoomExpired(room.expiresAt)) {
    throw new Error("Room expired or not found");
  }

  const item = await prisma.clipboardItem.create({
    data: {
      roomId,
      content,
    },
  });

  return item;
}

export async function getLatestUnconsumedItem(roomId: string) {
  const item = await prisma.clipboardItem.findFirst({
    where: {
      roomId,
      consumed: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return item;
}

export async function markItemAsConsumed(itemId: string) {
  const item = await prisma.clipboardItem.update({
    where: { id: itemId },
    data: { consumed: true },
  });

  return item;
}

export async function cleanupExpiredRooms() {
  const result = await prisma.room.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });

  return result.count;
}
