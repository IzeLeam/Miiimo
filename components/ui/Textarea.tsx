"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full px-4 py-3 text-base rounded-xl border border-neutral-200 bg-white",
          "placeholder:text-neutral-400 resize-none",
          "focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent",
          "transition-all duration-200",
          "dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:focus:ring-white",
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";
