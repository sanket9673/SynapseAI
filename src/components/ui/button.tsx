import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-carbon-black text-paper-white hover:bg-slate active:scale-[0.98] border border-carbon-black",
  secondary:
    "bg-paper-white text-carbon-black hover:bg-mist-gray active:scale-[0.98] border border-ash",
  outline:
    "bg-transparent text-slate hover:text-carbon-black hover:border-carbon-black border border-ash active:scale-[0.98]",
  ghost:
    "bg-transparent text-slate hover:text-carbon-black hover:bg-mist-gray/80 border border-transparent",
  danger:
    "bg-error text-white hover:bg-red-700 active:scale-[0.98] border border-transparent",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-md font-medium",
  md: "h-11 px-5 text-sm gap-2 rounded-lg font-medium",
  lg: "h-13 px-7 text-base gap-2.5 rounded-lg font-medium",
  icon: "h-10 w-10 p-0 rounded-lg justify-center",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={isLoading ? "true" : undefined}
        className={cn(
          "inline-flex items-center justify-center select-none whitespace-nowrap",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-carbon-black focus-visible:ring-offset-2 focus-visible:ring-offset-warm-canvas",
          "transition-all duration-150 ease-out",
          "disabled:opacity-40 disabled:pointer-events-none disabled:cursor-not-allowed",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-current" data-testid="button-spinner" />
            {size !== "icon" && children ? <span>{children}</span> : null}
          </>
        ) : (
          <>
            {leftIcon ? <span className="inline-flex shrink-0">{leftIcon}</span> : null}
            {children}
            {rightIcon ? <span className="inline-flex shrink-0">{rightIcon}</span> : null}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
