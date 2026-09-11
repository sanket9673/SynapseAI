import * as React from "react";
import { cn } from "@/lib/utils";

export type SkeletonVariant = "rectangular" | "circular" | "text";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
}

const variantStyles: Record<SkeletonVariant, string> = {
  rectangular: "rounded-2xl",
  circular: "rounded-full",
  text: "rounded-lg h-4 w-full",
};

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = "rectangular", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-gradient-to-r from-mist-gray via-ash/40 to-mist-gray bg-[length:200%_100%] animate-shimmer",
          variantStyles[variant],
          className
        )}
        {...props}
      >
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
);

Skeleton.displayName = "Skeleton";
