"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { formatShortcutKey, useIsMac } from "@/lib/platform";

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  keys?: string[];
}

export const Kbd = React.forwardRef<HTMLElement, KbdProps>(
  ({ className, keys, children, ...props }, ref) => {
    const isMac = useIsMac();

    return (
      <kbd
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1 rounded border border-ash/80 bg-mist-gray px-1.5 py-0.5 font-mono text-xs font-semibold text-slate select-none",
          className
        )}
        {...props}
      >
        {keys && keys.length > 0 ? (
          keys.map((key, index) => {
            const formatted = formatShortcutKey(key, isMac);
            return (
              <React.Fragment key={index}>
                {index > 0 && <span className="text-smoke">+</span>}
                <span>{formatted}</span>
              </React.Fragment>
            );
          })
        ) : typeof children === "string" ? (
          formatShortcutKey(children, isMac)
        ) : (
          children
        )}
      </kbd>
    );
  }
);

Kbd.displayName = "Kbd";
