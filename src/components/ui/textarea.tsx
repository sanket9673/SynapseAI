import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  helperText?: string;
  shortcutHint?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, helperText, shortcutHint, id, ...props }, ref) => {
    const generatedId = React.useId();
    const textareaId = id || generatedId;
    const errorId = error ? `${textareaId}-error` : undefined;
    const helperId = helperText ? `${textareaId}-helper` : undefined;

    return (
      <div className="w-full space-y-1.5">
        <div className="relative">
          <textarea
            id={textareaId}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={errorId || helperId}
            className={cn(
              "flex min-h-[120px] w-full rounded-2xl border bg-mist-gray px-4 py-3 text-sm text-carbon-black placeholder:text-smoke",
              "transition-colors duration-150 ease-in-out",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-carbon-black focus-visible:bg-paper-white",
              error
                ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500"
                : "border-ash/50 hover:border-ash focus-visible:border-carbon-black",
              "disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            {...props}
          />
          {shortcutHint && (
            <div className="pointer-events-none absolute bottom-3 right-3 flex items-center">
              <span className="rounded-md border border-ash/80 bg-paper-white px-2 py-0.5 font-mono text-[11px] font-semibold text-slate">
                {shortcutHint}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between px-1 text-xs">
          {error ? (
            <p id={errorId} className="font-medium text-red-600 font-mono" role="alert">
              {error}
            </p>
          ) : helperText ? (
            <p id={helperId} className="text-smoke font-mono">
              {helperText}
            </p>
          ) : null}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
