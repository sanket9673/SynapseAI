import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = "neutral" | "accent" | "success" | "error" | "warning" | "outline" | "mint" | "yellow";
export type BadgeSize = "sm" | "md";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  neutral: "bg-mist-gray text-slate border border-ash/50",
  accent: "bg-mint-chip text-carbon-black border border-mint-chip",
  mint: "bg-mint-chip text-carbon-black border border-mint-chip",
  success: "bg-mint-chip text-carbon-black border border-mint-chip",
  error: "bg-red-100 text-red-800 border border-red-200",
  warning: "bg-voltage-yellow text-carbon-black border border-voltage-yellow",
  yellow: "bg-voltage-yellow text-carbon-black border border-voltage-yellow",
  outline: "bg-paper-white text-slate border border-ash",
};

const dotColorStyles: Record<BadgeVariant, string> = {
  neutral: "bg-slate",
  accent: "bg-carbon-black",
  mint: "bg-carbon-black",
  success: "bg-carbon-black",
  error: "bg-red-600",
  warning: "bg-carbon-black",
  yellow: "bg-carbon-black",
  outline: "bg-slate",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-3 py-0.5 text-[11px] font-medium tracking-tight rounded-[64px] gap-1.5",
  md: "px-4 py-1 text-xs font-semibold tracking-normal rounded-[64px] gap-2",
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
