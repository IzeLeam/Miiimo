"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { QRCodeDisplay } from "@/components/room/QRCodeDisplay";
import { SendForm } from "@/components/room/SendForm";
import { ReceiveDisplay } from "@/components/room/ReceiveDisplay";
import { ExpiryTimer } from "@/components/room/ExpiryTimer";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface RoomData {
  id: string;
  code: string;
  expiresAt: string;
  serverNow?: string;
}

interface RoomClientProps {
  code: string;
}

export function RoomClient({ code }: RoomClientProps) {
  const [room, setRoom] = useState<RoomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    async function fetchRoom() {
      try {
        const response = await fetch(`/api/rooms/${code}`);

        if (response.status === 404) {
          setError("Room not found");
          return;
        }

        if (response.status === 410) {
          setError("This room has expired");
          setExpired(true);
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to load room");
        }

        const data = await response.json();
        setRoom(data);
      } catch {
        setError("Failed to load room");
      } finally {
        setLoading(false);
      }
    }

    fetchRoom();
  }, [code]);

  const handleExpire = () => {
    setExpired(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-800 rounded" />
        </div>
      </div>
    );
  }

  if (error || expired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center space-y-6 py-12">
            <div className="w-16 h-16 mx-auto rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-neutral-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
                {expired ? "Room Expired" : "Room Not Found"}
              </h1>
              <p className="text-neutral-500 dark:text-neutral-400">
                {expired
                  ? "This room has expired. Create a new room to continue sharing."
                  : "The room code you entered doesn't exist."}
              </p>
            </div>

            <Link href="/">
              <Button size="lg" className="w-full">
                Create New Room
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!room) return null;

  const roomUrl =
    typeof window !== "undefined" ? `${window.location.origin}/${room.code}` : "";

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
            Room{" "}
            <span className="font-mono text-neutral-600 dark:text-neutral-400">
              {room.code}
            </span>
          </h1>
          <ExpiryTimer
            expiresAt={new Date(room.expiresAt)}
            serverOffsetMs={
              room.serverNow
                ? new Date(room.serverNow).getTime() - Date.now()
                : 0
            }
            onExpire={handleExpire}
          />
        </div>

        <div className="grid gap-6 md:gap-8 md:grid-cols-[320px_1fr] lg:grid-cols-[360px_1fr] items-start">
          {/* QR Code Section */}
          <Card className="md:sticky md:top-6">
            <CardContent className="py-8">
              <div className="flex flex-col items-center">
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
                  Scan this QR code from another device
                </p>
                <QRCodeDisplay url={roomUrl} />
              </div>
            </CardContent>
          </Card>

          {/* Right column: Send + Receive */}
          <div className="space-y-6">
            <Card>
              <CardContent>
                <h2 className="text-lg font-medium text-neutral-900 dark:text-white mb-4">
                  Send Text
                </h2>
                <SendForm roomCode={room.code} />
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h2 className="text-lg font-medium text-neutral-900 dark:text-white mb-4">
                  Received Text
                </h2>
                <ReceiveDisplay roomCode={room.code} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <Link href="/">
            <Button variant="ghost" size="sm">
              Create new room
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
