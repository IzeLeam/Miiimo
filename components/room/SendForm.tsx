"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface SendFormProps {
  roomCode: string;
  onSent?: () => void;
}

export function SendForm({ roomCode, onSent }: SendFormProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [sentPreview, setSentPreview] = useState<string | null>(null);

  const handleSend = async () => {
    setLoading(true);
    setError(null);

    try {
      const clipboardAvailable =
        typeof navigator !== "undefined" &&
        typeof window !== "undefined" &&
        !!navigator.clipboard &&
        window.isSecureContext;

      if (!clipboardAvailable) {
        throw new Error(
          "Clipboard access unavailable. Use HTTPS/localhost and allow clipboard permissions."
        );
      }

      const content = await navigator.clipboard.readText();

      if (!content || !content.trim()) {
        throw new Error("Clipboard is empty");
      }

      if (content.length > 10000) {
        throw new Error("Content too long (max 10,000 characters)");
      }

      const response = await fetch(`/api/rooms/${roomCode}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim() }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to send");
      }

      setStatus("sent");
      setSentPreview(
        content.length > 100 ? content.slice(0, 100) + "…" : content
      );
      onSent?.();

      setTimeout(() => {
        setStatus("idle");
        setSentPreview(null);
      }, 5000);
    } catch (err) {
      if (err instanceof Error && err.name === "NotAllowedError") {
        setError("Clipboard access denied. Please allow clipboard permissions.");
      } else {
        setError(err instanceof Error ? err.message : "Failed to send");
      }
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center space-y-3">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Click the button below to send your clipboard content
        </p>

        <Button
          onClick={handleSend}
          disabled={loading}
          loading={loading}
          size="lg"
          className="w-full sm:w-auto min-w-[200px]"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          Send Clipboard
        </Button>
      </div>

      {status === "sent" && sentPreview && (
        <div className="space-y-2">
          <div className="flex justify-center">
            <StatusBadge status="sent" />
          </div>
          <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
              Sent:
            </p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 font-mono break-all">
              {sentPreview}
            </p>
          </div>
        </div>
      )}

      {status === "error" && error && (
        <div className="flex justify-center">
          <StatusBadge status="error">{error}</StatusBadge>
        </div>
      )}
    </div>
  );
}
