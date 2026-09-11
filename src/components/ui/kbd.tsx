import * as React from "react";
import { cn } from "@/lib/utils";

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  keys?: string[];
}

export const Kbd = React.forwardRef<HTMLElement, KbdProps>(
  ({ className, keys, children, ...props }, ref) => {
    return (
      <kbd
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1 rounded border border-border-dim bg-subtle px-1.5 py-0.5 font-mono text-xs font-medium text-text-secondary shadow-sm select-none",
          className
        )}
        {...props}
      >
        {keys && keys.length > 0 ? (
          keys.map((key, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span className="text-text-tertiary">+</span>}
              <span>{key}</span>
            </React.Fragment>
          ))
        ) : (
          children
        )}
      </kbd>
    );
  }
);

Kbd.displayName = "Kbd";
