"use client";

import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "waiting" | "received" | "sent" | "error" | "expired";
  children?: React.ReactNode;
}

export function StatusBadge({ status, children }: StatusBadgeProps) {
  const statusStyles = {
    waiting: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
    received: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
    sent: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
    error: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400",
    expired: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
  };

  const defaultLabels = {
    waiting: "Waiting for a device…",
    received: "Text received",
    sent: "Text sent successfully",
    error: "Error occurred",
    expired: "Room expired",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium",
        statusStyles[status]
      )}
    >
      {status === "waiting" && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
        </span>
      )}
      {status === "received" && (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )}
      {status === "sent" && (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )}
      {children || defaultLabels[status]}
    </div>
  );
}
