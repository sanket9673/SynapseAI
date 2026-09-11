"use client";

import * as React from "react";
import {
  Brain,
  Sparkles,
  Layers,
  HelpCircle,
  Clock,
  Cpu,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Target,
} from "lucide-react";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Kbd,
} from "@/components/ui";
import { useAIGenerate } from "@/hooks/useAIGenerate";
import { PromptInput, GenerationSkeleton, GenerationError } from "@/components/prompt";
import { FlashcardDeck, StudyTabs } from "@/components/study";
import { QuizEngine } from "@/components/quiz";
import { RetestEngine } from "@/components/retest";

export default function SynapseHomePage() {
  const {
    status,
    data,
    error,
    meta,
    currentStep,
    generate,
    cancel,
    retry,
    reset,
  } = useAIGenerate();

  const [rawPayloadOpen, setRawPayloadOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"flashcards" | "quiz">("flashcards");
  const [activeMode, setActiveMode] = React.useState<"study" | "retest">("study");
  const [lastInputText, setLastInputText] = React.useState("");

  // Weakness tracking state
  const [wrongQuestionIds, setWrongQuestionIds] = React.useState<string[]>([]);
  const [flaggedCardIds, setFlaggedCardIds] = React.useState<string[]>([]);

  const handleGenerate = (text: string, options?: { mockMode?: boolean }) => {
    setLastInputText(text);
    setWrongQuestionIds([]);
    setFlaggedCardIds([]);
    setActiveMode("study");
    generate(text, options);
  };

  const handleMockFallback = () => {
    if (lastInputText) {
      generate(lastInputText, { mockMode: true });
    }
  };

  const totalWeakPoints = wrongQuestionIds.length + flaggedCardIds.length;

  return (
    <div className="min-h-screen bg-app text-text-primary selection:bg-accent-primary/30 selection:text-white pb-24">
      {/* Top Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-app/80 border-b border-border-dim px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-accent-primary to-indigo-400 flex items-center justify-center shadow-glow">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg tracking-tight text-white">
                SYNAPSE
              </span>
              <Badge variant="accent" size="sm" dot>
                AI Study Assistant
              </Badge>
            </div>
            <p className="text-[11px] text-text-tertiary font-mono hidden sm:block">
              AI-Native Active Recall & Pedagogical Synthesis Engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Targeted Remediation Mode Badge Trigger */}
          {totalWeakPoints > 0 && status === "success" && (
            <button
              type="button"
              onClick={() => setActiveMode(activeMode === "retest" ? "study" : "retest")}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-warning/10 hover:bg-warning/20 border border-warning/30 text-warning text-xs font-mono font-medium transition-colors cursor-pointer shadow-subtle"
            >
              <Target className="w-3.5 h-3.5 animate-pulse text-warning" />
              <span>
                Focus Mode: {totalWeakPoints} {totalWeakPoints === 1 ? "item" : "items"} to resolve
              </span>
            </button>
          )}

          <div className="hidden sm:flex items-center gap-2">
            <Kbd keys={["⌘", "Enter"]} />
            <span className="text-xs text-text-tertiary hidden md:inline">Quick Generate</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 space-y-8">
        {/* If Retest Mode is Active */}
        {activeMode === "retest" && data ? (
          <RetestEngine
            studySet={data}
            wrongQuestionIds={wrongQuestionIds}
            flaggedCardIds={flaggedCardIds}
            onDismiss={() => setActiveMode("study")}
            onQuestionsResolved={(resolved) => {
              setWrongQuestionIds((prev) => prev.filter((id) => !resolved.includes(id)));
            }}
            onCardsResolved={(resolved) => {
              setFlaggedCardIds((prev) => prev.filter((id) => !resolved.includes(id)));
            }}
          />
        ) : (
          <>
            {/* Hero Banner */}
            <section className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border-dim text-xs font-mono text-accent-primary shadow-subtle">
                <Sparkles className="h-3.5 w-3.5 text-accent-primary" />
                <span>Active Recall & Spaced Repetition Engine</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary">
                Transform Raw Knowledge into Permanent Memory.
              </h1>
              <p className="text-text-secondary text-sm sm:text-base max-w-2xl leading-relaxed">
                Paste notes, transcripts, or complex topics below. Synapse synthesizes high-retention flashcards and pedagogical quiz questions in seconds.
              </p>
            </section>

            {/* Prompt Input Area */}
            <section>
              <PromptInput
                onGenerate={handleGenerate}
                onCancel={cancel}
                isLoading={status === "loading"}
              />
            </section>

            {/* Dynamic Workspace Container */}
            <section className="space-y-6">
              {/* 1. LOADING STATE */}
              {status === "loading" && (
                <GenerationSkeleton step={currentStep} onCancel={cancel} />
              )}

              {/* 2. ERROR STATE */}
              {status === "error" && error && (
                <GenerationError
                  error={error}
                  onRetry={retry}
                  onReset={reset}
                  onMockFallback={handleMockFallback}
                />
              )}

              {/* 3. SUCCESS / DECK READY PREVIEW STATE */}
              {status === "success" && data && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  {/* Deck Summary Card */}
                  <Card glow className="border-accent-primary/40 bg-surface shadow-elevated">
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="success" dot size="sm">
                              Deck Synthesized
                            </Badge>
                            {meta && (
                              <>
                                <Badge variant="neutral" size="sm">
                                  <Cpu className="h-3 w-3 mr-1" />
                                  {meta.provider} • {meta.model}
                                </Badge>
                                <Badge variant="neutral" size="sm">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {meta.latencyMs}ms
                                </Badge>
                              </>
                            )}
                          </div>
                          <CardTitle className="text-xl sm:text-2xl text-white">
                            {data.title}
                          </CardTitle>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={reset}
                            leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
                          >
                            New Deck
                          </Button>
                        </div>
                      </div>
                      <CardDescription className="text-text-secondary text-sm pt-2 leading-relaxed">
                        {data.summary}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6 pt-0">
                      {/* Mode Tab Switcher */}
                      <div className="border-b border-border-dim pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <StudyTabs
                          activeTab={activeTab}
                          onTabChange={setActiveTab}
                          flashcardsCount={data.flashcards.length}
                          quizCount={data.quiz.length}
                        />

                        {totalWeakPoints > 0 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setActiveMode("retest")}
                            className="border-warning/40 text-warning hover:bg-warning/10 gap-2 self-start sm:self-auto"
                          >
                            <Target className="w-3.5 h-3.5" />
                            <span>Remediate Weak Points ({totalWeakPoints})</span>
                          </Button>
                        )}
                      </div>

                      {/* ACTIVE TAB CONTENT */}
                      {activeTab === "flashcards" && (
                        <div
                          id="panel-flashcards"
                          role="tabpanel"
                          aria-labelledby="tab-flashcards"
                          className="py-2"
                        >
                          <FlashcardDeck
                            cards={data.flashcards}
                            deckTitle={data.title || "Synthesized Study Deck"}
                            onMasteryChange={(cardId, masteryStatus) => {
                              if (masteryStatus === "needs-review") {
                                setFlaggedCardIds((prev) => Array.from(new Set([...prev, cardId])));
                              } else if (masteryStatus === "mastered") {
                                setFlaggedCardIds((prev) => prev.filter((id) => id !== cardId));
                              }
                            }}
                            onDeckComplete={(stats) => {
                              console.log("Deck practice completed:", stats);
                            }}
                          />
                        </div>
                      )}

                      {activeTab === "quiz" && (
                        <div
                          id="panel-quiz"
                          role="tabpanel"
                          aria-labelledby="tab-quiz"
                          className="py-2"
                        >
                          <QuizEngine
                            questions={data.quiz}
                            quizTitle={data.title || "Synthesized Knowledge Quiz"}
                            onRetestMissed={(missedIds) => {
                              setWrongQuestionIds(missedIds);
                              setActiveMode("retest");
                            }}
                            onQuizComplete={(summary) => {
                              console.log("Quiz assessment finished:", summary);
                            }}
                          />
                        </div>
                      )}

                      {/* Developer Raw JSON Inspector */}
                      <div className="pt-4 border-t border-border-dim">
                        <button
                          type="button"
                          onClick={() => setRawPayloadOpen(!rawPayloadOpen)}
                          className="flex items-center justify-between w-full text-xs font-mono text-text-tertiary hover:text-text-primary py-2 transition-colors"
                        >
                          <span>[Developer Mode] Inspect Raw AI Response Payload</span>
                          {rawPayloadOpen ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>

                        {rawPayloadOpen && (
                          <pre className="mt-2 p-4 rounded-lg bg-app border border-border-dim text-[11px] font-mono text-text-secondary overflow-x-auto max-h-80">
                            {JSON.stringify(
                              {
                                data,
                                meta,
                              },
                              null,
                              2
                            )}
                          </pre>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* 4. IDLE STATE ONBOARDING */}
              {status === "idle" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <Card className="border-border-dim bg-surface p-5 space-y-2.5">
                    <div className="h-8 w-8 rounded-lg bg-accent-subtle text-accent-primary flex items-center justify-center">
                      <Layers className="h-4 w-4" />
                    </div>
                    <h3 className="text-sm font-semibold text-text-primary">
                      1. Atomic Concept Flashcards
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      Extracts core themes into single-concept question-and-answer pairs with progressive hints and 3D flip physics.
                    </p>
                  </Card>

                  <Card className="border-border-dim bg-surface p-5 space-y-2.5">
                    <div className="h-8 w-8 rounded-lg bg-success-subtle text-success flex items-center justify-center">
                      <HelpCircle className="h-4 w-4" />
                    </div>
                    <h3 className="text-sm font-semibold text-text-primary">
                      2. 4-Option Multiple Choice
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      Generates rigorous distractor options and pedagogical rationale explanations for deeper comprehension.
                    </p>
                  </Card>

                  <Card className="border-border-dim bg-surface p-5 space-y-2.5">
                    <div className="h-8 w-8 rounded-lg bg-warning/10 text-warning flex items-center justify-center">
                      <Clock className="h-4 w-4" />
                    </div>
                    <h3 className="text-sm font-semibold text-text-primary">
                      3. Weakness Remediation
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      Automatically isolates missed quiz items and flagged flashcards for focused re-testing until 100% mastery.
                    </p>
                  </Card>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
