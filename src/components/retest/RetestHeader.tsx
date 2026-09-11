"use client";

import React from "react";
import { Target, X } from "lucide-react";
import { Progress, Button } from "@/components/ui";

export interface RetestHeaderProps {
  resolvedCount: number;
  totalInitial: number;
  masteryPercentage: number;
  onDismiss: () => void;
}

export const RetestHeader: React.FC<RetestHeaderProps> = ({
  resolvedCount,
  totalInitial,
  masteryPercentage,
  onDismiss,
}) => {
  const isComplete = masteryPercentage === 100;

  return (
    <div className="w-full bg-surface/90 backdrop-blur-md border-b border-border-dim px-4 py-3 sticky top-0 z-20">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-warning/10 text-warning border border-warning/30">
            <Target className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-semibold tracking-wider text-warning uppercase font-mono">
              Targeted Recall Mode
            </div>
            <div className="text-sm font-medium text-text-primary">
              Resolving Weak Points
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-1 max-w-xs">
          <div className="w-full">
            <div className="flex justify-between text-xs text-text-secondary mb-1">
              <span>Remediation Progress</span>
              <span className="font-medium font-mono text-text-primary">
                {resolvedCount} of {totalInitial} resolved ({masteryPercentage}%)
              </span>
            </div>
            <Progress
              value={masteryPercentage}
              className="h-2"
              indicatorColor={isComplete ? "bg-success" : "bg-warning"}
            />
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onDismiss}
          className="text-text-tertiary hover:text-text-primary"
          aria-label="Exit remediation"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
