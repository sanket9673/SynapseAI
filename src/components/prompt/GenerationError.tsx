"use client";

import * as React from "react";
import { RotateCcw, Bot, Edit3, ShieldAlert } from "lucide-react";
import { Notice, Button, Badge } from "@/components/ui";

export interface GenerationErrorProps {
  error: {
    code: string;
    message: string;
    actionableSuggestion: string;
    recoverable: boolean;
  };
  onRetry: () => void;
  onReset: () => void;
  onMockFallback: () => void;
}

export const GenerationError: React.FC<GenerationErrorProps> = ({
  error,
  onRetry,
  onReset,
  onMockFallback,
}) => {
  return (
    <div className="w-full space-y-4">
      <Notice
        variant="error"
        title={`Generation Halted [${error.code}]`}
        className="border-error/40 bg-surface shadow-elevated"
      >
        <div className="space-y-3 pt-1">
          <p className="text-text-primary text-sm font-medium leading-relaxed">
            {error.message}
          </p>

          <div className="p-3 rounded-lg bg-subtle/80 border border-border-dim text-xs space-y-1">
            <span className="font-mono text-text-tertiary uppercase tracking-wider block">
              Actionable Recommendation:
            </span>
            <p className="text-text-secondary leading-relaxed">
              {error.actionableSuggestion}
            </p>
          </div>

          {/* Action Button Strip */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {error.recoverable && (
              <Button
                size="sm"
                variant="primary"
                onClick={onRetry}
                leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
              >
                Try Again
              </Button>
            )}

            <Button
              size="sm"
              variant="secondary"
              onClick={onMockFallback}
              leftIcon={<Bot className="h-3.5 w-3.5" />}
            >
              Use Offline Mock
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={onReset}
              leftIcon={<Edit3 className="h-3.5 w-3.5" />}
            >
              Edit Input
            </Button>
          </div>
        </div>
      </Notice>
    </div>
  );
};
