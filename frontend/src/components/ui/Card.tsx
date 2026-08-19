import { forwardRef, type HTMLAttributes } from "react";

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function Card({ className = "", ...props }, ref) {
    return (
      <div
        ref={ref}
        className={`rounded-[24px] border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03),0_14px_40px_rgba(15,23,42,0.055)] ${className}`}
        {...props}
      />
    );
  },
);
