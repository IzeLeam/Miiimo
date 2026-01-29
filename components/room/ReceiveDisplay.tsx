"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface ReceivedItem {
  id: string;
  content: string;
  createdAt: string;
}

interface ReceiveDisplayProps {
  roomCode: string;
  pollingInterval?: number;
}

export function ReceiveDisplay({
  roomCode,
  pollingInterval = 2000,
}: ReceiveDisplayProps) {
  const [item, setItem] = useState<ReceivedItem | null>(null);
  const [status, setStatus] = useState<"waiting" | "received" | "error">(
    "waiting"
  );
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLatestItem = useCallback(async () => {
    try {
      const response = await fetch(`/api/rooms/${roomCode}/receive`);

      if (!response.ok) {
        if (response.status === 410) {
          setError("Room expired");
          setStatus("error");
          return false;
        }
        return true;
      }

      const data = await response.json();

      if (data.item && (!item || data.item.id !== item.id)) {
        setItem(data.item);
        setStatus("received");

        // Auto-copy on receive
        try {
          await navigator.clipboard.writeText(data.item.content);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          // Clipboard access denied, user will copy manually
        }

        // Mark as consumed
        await fetch(`/api/rooms/${roomCode}/receive?consume=true`);
      }

      return true;
    } catch {
      return true;
    }
  }, [roomCode, item]);

  useEffect(() => {
    let active = true;

    const poll = async () => {
      if (!active) return;

      const shouldContinue = await fetchLatestItem();

      if (active && shouldContinue) {
        setTimeout(poll, pollingInterval);
      }
    };

    poll();

    return () => {
      active = false;
    };
  }, [fetchLatestItem, pollingInterval]);

  const handleCopy = async () => {
    if (!item) return;

    try {
      await navigator.clipboard.writeText(item.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Failed to copy to clipboard");
    }
  };

  if (error) {
    return (
      <div className="text-center">
        <StatusBadge status="error">{error}</StatusBadge>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center">
        <StatusBadge status="waiting" />
        <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
          Scan the QR code from another device to send text
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center">
        <StatusBadge status="received">
          {copied ? "Copied to clipboard!" : "Text received"}
        </StatusBadge>
      </div>

      <Card>
        <CardContent>
          <pre className="whitespace-pre-wrap break-words text-sm text-neutral-700 dark:text-neutral-300 font-mono max-h-48 overflow-y-auto">
            {item.content}
          </pre>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button
          onClick={handleCopy}
          variant={copied ? "secondary" : "primary"}
          className="min-w-[160px]"
        >
          {copied ? (
            <>
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy to clipboard
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
