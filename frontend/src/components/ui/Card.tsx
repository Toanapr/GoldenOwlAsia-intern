import { forwardRef, type HTMLAttributes } from "react";

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function Card({ className = "", ...props }, ref) {
    return (
      <div
        ref={ref}
        className={`rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${className}`}
        {...props}
      />
    );
  },
);
