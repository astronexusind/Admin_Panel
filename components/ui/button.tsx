"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const variantClasses = {
  primary:
    "bg-primary text-white hover:bg-primary/90 focus-visible:ring-primary/60 disabled:bg-primary/50",
  secondary:
    "border border-border/60 bg-card text-foreground hover:bg-card/80 focus-visible:ring-primary/30 disabled:opacity-60",
  ghost: "bg-transparent text-foreground hover:bg-card/70 focus-visible:ring-primary/20",
  outline:
    "border border-border bg-transparent text-foreground hover:border-primary/40 hover:bg-primary/10 focus-visible:ring-primary/40",
  "danger-outline":
    "border border-danger/40 bg-transparent text-danger hover:bg-danger/10 focus-visible:ring-danger/40",
  danger:
    "bg-danger/90 text-white hover:bg-danger focus-visible:ring-danger/50 disabled:bg-danger/40"
} as const;

const sizeClasses = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
  icon: "h-11 w-11"
} as const;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantClasses;
  size?: keyof typeof sizeClasses;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl font-medium outline-none ring-offset-0 transition-colors duration-200 focus-visible:ring-2 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
);

Button.displayName = "Button";
