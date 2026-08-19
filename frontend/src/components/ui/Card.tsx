import { forwardRef, type HTMLAttributes } from "react";

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function Card({ className = "", ...props }, ref) {
    return (
      <div
        ref={ref}
        className={`rounded-xl border border-border bg-surface shadow-sm ${className}`}
        {...props}
      />
    );
  },
);
