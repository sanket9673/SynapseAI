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
      <Card className="border border-ash/50 bg-paper-white rounded-[32px]">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="h-10 w-10 rounded-2xl bg-carbon-black text-paper-white flex items-center justify-center">
                <Sparkles className="h-5 w-5 animate-spin text-mint-chip" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-carbon-black uppercase tracking-tight">
                    Active Recall Synthesis
                  </h4>
                  <Badge variant="accent" size="sm" dot>
                    Step {currentStepNum} of {totalSteps}
                  </Badge>
                </div>
                <p className="text-xs font-mono font-medium text-slate animate-pulse">
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
                className="border-red-400 text-red-700 hover:bg-red-50 self-end sm:self-auto"
              >
                Cancel Generation
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-2">
          <div className="flex justify-between text-[11px] font-mono font-semibold text-smoke">
            <span>Overall Synthesis Progress</span>
            <span>{stepProgress}%</span>
          </div>
          <Progress value={stepProgress} indicatorColor="bg-carbon-black" />
        </CardContent>
      </Card>

      {/* Wireframe Flashcard Proportion Canvas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Flashcard Skeleton (Span 2 cols on desktop) */}
        <Card className="md:col-span-2 border border-ash/40 bg-paper-white p-6 sm:p-8 space-y-5 rounded-[32px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton variant="rectangular" className="h-6 w-28 rounded-[64px]" />
              <Skeleton variant="rectangular" className="h-6 w-20 rounded-[64px]" />
            </div>
            <Skeleton variant="rectangular" className="h-5 w-16 rounded-md" />
          </div>

          <div className="space-y-3 py-4">
            <Skeleton variant="text" className="h-7 w-5/6 rounded-lg" />
            <Skeleton variant="text" className="h-5 w-4/6 rounded-lg" />
            <Skeleton variant="text" className="h-5 w-full rounded-lg" />
          </div>

          <div className="pt-4 border-t border-ash/40 flex items-center justify-between">
            <Skeleton variant="rectangular" className="h-10 w-32 rounded-lg" />
            <Skeleton variant="rectangular" className="h-10 w-36 rounded-lg" />
          </div>
        </Card>

        {/* Quiz Question Wireframe Skeleton */}
        <Card className="border border-ash/40 bg-paper-white p-6 space-y-4 rounded-[32px]">
          <div className="flex items-center justify-between">
            <Skeleton variant="rectangular" className="h-5 w-24 rounded-md" />
            <Skeleton variant="circular" className="h-5 w-5" />
          </div>

          <Skeleton variant="text" className="h-6 w-full rounded-lg" />

          <div className="space-y-2.5 pt-2">
            <Skeleton variant="rectangular" className="h-10 w-full rounded-xl" />
            <Skeleton variant="rectangular" className="h-10 w-full rounded-xl" />
            <Skeleton variant="rectangular" className="h-10 w-full rounded-xl" />
            <Skeleton variant="rectangular" className="h-10 w-full rounded-xl" />
          </div>
        </Card>
      </div>

      {/* Bottom Wireframe Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-paper-white border border-ash/40 flex items-center gap-3">
          <Layers className="h-4 w-4 text-slate" />
          <div className="space-y-1 flex-1">
            <div className="text-xs font-bold text-carbon-black uppercase font-mono">Flashcards Matrix</div>
            <Skeleton variant="text" className="h-3 w-20" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-paper-white border border-ash/40 flex items-center gap-3">
          <HelpCircle className="h-4 w-4 text-slate" />
          <div className="space-y-1 flex-1">
            <div className="text-xs font-bold text-carbon-black uppercase font-mono">4-Option Quiz Suite</div>
            <Skeleton variant="text" className="h-3 w-24" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-paper-white border border-ash/40 flex items-center gap-3">
          <CheckCircle2 className="h-4 w-4 text-slate" />
          <div className="space-y-1 flex-1">
            <div className="text-xs font-bold text-carbon-black uppercase font-mono">Pedagogical Verification</div>
            <Skeleton variant="text" className="h-3 w-28" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
