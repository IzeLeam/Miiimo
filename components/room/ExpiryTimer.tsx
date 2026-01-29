"use client";

import { useEffect, useState } from "react";
import { formatTimeRemaining } from "@/lib/utils";

interface ExpiryTimerProps {
  expiresAt: Date;
  onExpire?: () => void;
}

export function ExpiryTimer({ expiresAt, onExpire }: ExpiryTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(
    formatTimeRemaining(expiresAt)
  );
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = formatTimeRemaining(expiresAt);
      setTimeRemaining(remaining);

      if (remaining === "Expired") {
        setIsExpired(true);
        onExpire?.();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  return (
    <div className="flex items-center gap-2 text-sm">
      <svg
        className={`w-4 h-4 ${
          isExpired ? "text-red-500" : "text-neutral-400"
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span
        className={
          isExpired
            ? "text-red-500 font-medium"
            : "text-neutral-500 dark:text-neutral-400"
        }
      >
        {isExpired ? "Expired" : `Expires in ${timeRemaining}`}
      </span>
    </div>
  );
}
