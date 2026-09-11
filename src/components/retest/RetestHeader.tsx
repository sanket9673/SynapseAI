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
    <div className="w-full bg-paper-white/90 backdrop-blur-md border-b border-ash/50 px-6 py-3.5 sticky top-0 z-20">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-voltage-yellow text-carbon-black border border-voltage-yellow">
            <Target className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-bold tracking-wider text-carbon-black uppercase font-mono">
              Targeted Remediation
            </div>
            <div className="text-sm font-medium text-slate">
              Resolving Weak Points
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-1 max-w-xs">
          <div className="w-full">
            <div className="flex justify-between text-xs text-smoke font-mono font-bold mb-1">
              <span>Remediation Progress</span>
              <span className="text-carbon-black">
                {resolvedCount} of {totalInitial} ({masteryPercentage}%)
              </span>
            </div>
            <Progress
              value={masteryPercentage}
              className="h-2"
              indicatorColor={isComplete ? "bg-emerald-600" : "bg-carbon-black"}
            />
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onDismiss}
          className="text-smoke hover:text-carbon-black rounded-xl"
          aria-label="Exit remediation"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
