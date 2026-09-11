import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = "neutral" | "accent" | "success" | "error" | "warning" | "outline";
export type BadgeSize = "sm" | "md";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  neutral: "bg-subtle text-text-secondary border border-border-dim",
  accent: "bg-accent-subtle text-accent-primary border border-accent-primary/30",
  success: "bg-success-subtle text-success border border-success/30",
  error: "bg-error-subtle text-error border border-error/30",
  warning: "bg-warning/10 text-warning border border-warning/30",
  outline: "bg-transparent text-text-secondary border border-border-bright",
};

const dotColorStyles: Record<BadgeVariant, string> = {
  neutral: "bg-text-tertiary",
  accent: "bg-accent-primary",
  success: "bg-success",
  error: "bg-error",
  warning: "bg-warning",
  outline: "bg-text-secondary",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-[11px] font-medium tracking-tight rounded-md gap-1.5",
  md: "px-2.5 py-1 text-xs font-medium tracking-normal rounded-lg gap-2",
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = "neutral",
      size = "sm",
      dot = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center select-none font-mono transition-colors",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {dot && (
          <span className="relative flex h-1.5 w-1.5 shrink-0" data-testid="badge-dot">
            <span
              className={cn(
                "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                dotColorStyles[variant]
              )}
            />
            <span
              className={cn(
                "relative inline-flex h-1.5 w-1.5 rounded-full",
                dotColorStyles[variant]
              )}
            />
          </span>
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";
