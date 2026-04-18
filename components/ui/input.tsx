import * as React from "react";

import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-2xl border border-border bg-card/70 px-4 text-sm text-foreground placeholder:text-muted focus:border-primary/60 focus:bg-card focus:outline-none",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";
