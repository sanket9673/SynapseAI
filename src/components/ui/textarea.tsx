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
              "flex min-h-[100px] w-full rounded-lg border bg-surface px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary",
              "transition-colors duration-150 ease-in-out",
              "focus-visible:outline-none focus-visible:ring-1",
              error
                ? "border-error focus-visible:border-error focus-visible:ring-error"
                : "border-border-dim hover:border-border-bright focus-visible:border-accent-primary focus-visible:ring-accent-primary",
              "disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            {...props}
          />
          {shortcutHint && (
            <div className="pointer-events-none absolute bottom-2.5 right-3 flex items-center">
              <span className="rounded border border-border-dim bg-subtle/80 px-1.5 py-0.5 font-mono text-[11px] text-text-tertiary shadow-sm backdrop-blur-sm">
                {shortcutHint}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between px-0.5 text-xs">
          {error ? (
            <p id={errorId} className="font-medium text-error" role="alert">
              {error}
            </p>
          ) : helperText ? (
            <p id={helperId} className="text-text-tertiary">
              {helperText}
            </p>
          ) : null}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
