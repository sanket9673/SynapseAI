"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Sparkles, StopCircle, Layers, HelpCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, Badge, Progress, Skeleton, Button } from "@/components/ui";
import type { GenerationStep } from "@/hooks/useAIGenerate";

export interface GenerationSkeletonProps {
  step: GenerationStep | null;
  onCancel?: () => void;
}

export const GenerationSkeleton: React.FC<GenerationSkeletonProps> = ({
  step,
  onCancel,
}) => {
  const currentStepNum = step?.step ?? 1;
  const totalSteps = step?.total ?? 3;
  const stepProgress = Math.round((currentStepNum / totalSteps) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="w-full space-y-6"
    >
      {/* Active Synthesis Status Banner */}
      <Card glow className="border-accent-primary/40 bg-surface">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-accent-primary/20 border border-accent-primary/40 flex items-center justify-center text-accent-primary">
                <Sparkles className="h-5 w-5 animate-spin text-accent-primary" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-text-primary">
                    AI Active Recall Synthesis
                  </h4>
                  <Badge variant="accent" size="sm" dot>
                    Step {currentStepNum} of {totalSteps}
                  </Badge>
                </div>
                <p className="text-xs font-mono text-accent-primary animate-pulse">
                  {step?.label ?? "Synthesizing study primitives..."}
                </p>
              </div>
            </div>

            {onCancel && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={onCancel}
                leftIcon={<StopCircle className="h-3.5 w-3.5" />}
                className="border-error/40 text-error hover:bg-error/10 self-end sm:self-auto"
              >
                Cancel Generation
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-2">
          <div className="flex justify-between text-[11px] font-mono text-text-tertiary">
            <span>Overall Synthesis Progress</span>
            <span>{stepProgress}%</span>
          </div>
          <Progress value={stepProgress} indicatorColor="bg-accent-primary" />
        </CardContent>
      </Card>

      {/* Wireframe Flashcard Proportion Canvas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Flashcard Skeleton (Span 2 cols on desktop) */}
        <Card className="md:col-span-2 border-border-dim bg-surface/80 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton variant="rectangular" className="h-5 w-24 rounded-full" />
              <Skeleton variant="rectangular" className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton variant="rectangular" className="h-4 w-12 rounded" />
          </div>

          <div className="space-y-3 py-4">
            <Skeleton variant="text" className="h-6 w-5/6" />
            <Skeleton variant="text" className="h-4 w-4/6" />
            <Skeleton variant="text" className="h-4 w-full" />
          </div>

          <div className="pt-4 border-t border-border-dim/60 flex items-center justify-between">
            <Skeleton variant="rectangular" className="h-8 w-28 rounded-lg" />
            <Skeleton variant="rectangular" className="h-8 w-32 rounded-lg" />
          </div>
        </Card>

        {/* Quiz Question Wireframe Skeleton */}
        <Card className="border-border-dim bg-surface/80 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton variant="rectangular" className="h-4 w-20 rounded" />
            <Skeleton variant="circular" className="h-5 w-5" />
          </div>

          <Skeleton variant="text" className="h-5 w-full" />

          <div className="space-y-2 pt-2">
            <Skeleton variant="rectangular" className="h-8 w-full rounded-md" />
            <Skeleton variant="rectangular" className="h-8 w-full rounded-md" />
            <Skeleton variant="rectangular" className="h-8 w-full rounded-md" />
            <Skeleton variant="rectangular" className="h-8 w-full rounded-md" />
          </div>
        </Card>
      </div>

      {/* Bottom Wireframe Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 rounded-lg bg-surface border border-border-dim flex items-center gap-2.5">
          <Layers className="h-4 w-4 text-text-tertiary" />
          <div className="space-y-1 flex-1">
            <div className="text-xs font-medium text-text-secondary">Flashcards Matrix</div>
            <Skeleton variant="text" className="h-3 w-16" />
          </div>
        </div>

        <div className="p-3 rounded-lg bg-surface border border-border-dim flex items-center gap-2.5">
          <HelpCircle className="h-4 w-4 text-text-tertiary" />
          <div className="space-y-1 flex-1">
            <div className="text-xs font-medium text-text-secondary">4-Option Quiz Suite</div>
            <Skeleton variant="text" className="h-3 w-20" />
          </div>
        </div>

        <div className="p-3 rounded-lg bg-surface border border-border-dim flex items-center gap-2.5">
          <CheckCircle2 className="h-4 w-4 text-text-tertiary" />
          <div className="space-y-1 flex-1">
            <div className="text-xs font-medium text-text-secondary">Pedagogical Verification</div>
            <Skeleton variant="text" className="h-3 w-24" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
