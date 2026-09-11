"use client";

import * as React from "react";
import { RotateCcw, Bot, Edit3 } from "lucide-react";
import { Notice, Button } from "@/components/ui";

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
        className="border border-red-200 bg-paper-white rounded-[32px] p-6 sm:p-8"
      >
        <div className="space-y-4 pt-1">
          <p className="text-carbon-black text-sm font-semibold leading-relaxed">
            {error.message}
          </p>

          <div className="p-4 rounded-2xl bg-mist-gray border border-ash/50 text-xs space-y-1">
            <span className="font-mono text-smoke uppercase tracking-wider block font-bold">
              Actionable Recommendation:
            </span>
            <p className="text-slate leading-relaxed">
              {error.actionableSuggestion}
            </p>
          </div>

          {/* Action Button Strip */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
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
