"use client";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-neutral-200 dark:bg-neutral-700 rounded ${className}`}
    />
  );
}

export function QRCodeSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Skeleton className="w-[280px] h-[280px] rounded-xl" />
      <Skeleton className="w-48 h-5" />
    </div>
  );
}

export function ContentSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}
