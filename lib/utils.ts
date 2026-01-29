import { customAlphabet } from "nanoid";

const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const nanoid = customAlphabet(alphabet, 6);

export function generateRoomCode(): string {
  return nanoid();
}

export function getRoomExpiryDate(minutes: number = 10): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}

export function isRoomExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}

export function formatTimeRemaining(expiresAt: Date, serverOffsetMs = 0): string {
  const now = Date.now() + serverOffsetMs;
  const diff = expiresAt.getTime() - now;
  if (diff <= 0) return "Expired";
  
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}

export function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
