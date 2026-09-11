"use client";

import * as React from "react";
import {
  Brain,
  Layers,
  HelpCircle,
  Clock,
  Cpu,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Target,
  History,
  Share2,
  Volume2,
  VolumeX,
  Keyboard,
  Search,
} from "lucide-react";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Kbd,
} from "@/components/ui";
import { useAIGenerate } from "@/hooks/useAIGenerate";
import { PromptInput, GenerationSkeleton, GenerationError } from "@/components/prompt";
import { FlashcardDeck, StudyTabs } from "@/components/study";
import { QuizEngine } from "@/components/quiz";
import { RetestEngine } from "@/components/retest";
import { DeckHistoryDrawer } from "@/components/history";
import { ExportModal } from "@/components/export";
import { CommandPalette, ShortcutsModal } from "@/components/palette";
import { deckStorage } from "@/lib/storage";
import { sound } from "@/lib/sound";
import type { CommandAction } from "@/types/palette";

export default function SynapseHomePage() {
  const {
    status,
    data,
    error,
    meta,
    currentStep,
    generate,
    loadDeck,
    cancel,
    retry,
    reset,
  } = useAIGenerate();

  const [rawPayloadOpen, setRawPayloadOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"flashcards" | "quiz">("flashcards");
  const [activeMode, setActiveMode] = React.useState<"study" | "retest">("study");
  const [lastInputText, setLastInputText] = React.useState("");

  // History & Export modal states
  const [isHistoryOpen, setIsHistoryOpen] = React.useState(false);
  const [isExportOpen, setIsExportOpen] = React.useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = React.useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);
  const [historyCount, setHistoryCount] = React.useState(0);

  // Sync mute state on mount
  React.useEffect(() => {
    setIsMuted(sound.isMuted());
  }, []);

  const handleToggleMute = () => {
    const next = sound.toggleMute();
    setIsMuted(next);
  };

  // Weakness tracking state
  const [wrongQuestionIds, setWrongQuestionIds] = React.useState<string[]>([]);
  const [flaggedCardIds, setFlaggedCardIds] = React.useState<string[]>([]);

  // Update history count
  const refreshHistoryCount = React.useCallback(() => {
    setHistoryCount(deckStorage.getAllDeckSummaries().length);
  }, []);

  React.useEffect(() => {
    refreshHistoryCount();
  }, [refreshHistoryCount]);

  // Auto-save generated deck to local storage
  React.useEffect(() => {
    if (status === "success" && data && data.id) {
      deckStorage.saveDeck(data);
      refreshHistoryCount();
    }
  }, [status, data, refreshHistoryCount]);

  // Global keyboard shortcuts for Command Palette (⌘K) and Shortcuts HUD (?)
  React.useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isEditing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);

      // ⌘K or Ctrl+K opens Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsPaletteOpen((prev) => !prev);
        return;
      }

      // ? opens Shortcuts HUD (unless user is typing in a text field)
      if (e.key === "?" && !isEditing && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
        return;
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

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

  const handleSelectHistoryDeck = (deckId: string) => {
    const saved = deckStorage.getDeckById(deckId);
    if (saved) {
      loadDeck(saved);
      setWrongQuestionIds([]);
      setFlaggedCardIds([]);
      setActiveMode("study");
    }
  };

  const totalWeakPoints = wrongQuestionIds.length + flaggedCardIds.length;

  // Command palette actions
  const commandActions: CommandAction[] = React.useMemo(() => {
    const actions: CommandAction[] = [
      {
        id: "nav-flashcards",
        title: "Study Flashcards",
        description: "Switch to 3D active recall flashcard deck",
        category: "Navigation",
        shortcut: ["1"],
        icon: <Layers className="w-4 h-4 text-carbon-black" />,
        perform: () => {
          setActiveMode("study");
          setActiveTab("flashcards");
        },
        keywords: ["card", "flashcard", "flip", "study", "deck"],
      },
      {
        id: "nav-quiz",
        title: "Practice Quiz",
        description: "Switch to 4-option multiple choice assessment",
        category: "Navigation",
        shortcut: ["2"],
        icon: <HelpCircle className="w-4 h-4 text-carbon-black" />,
        perform: () => {
          setActiveMode("study");
          setActiveTab("quiz");
        },
        keywords: ["quiz", "test", "question", "options", "exam"],
      },
      {
        id: "nav-retest",
        title: "Targeted Remediation Mode",
        description: "Isolate missed quiz questions and weak flashcards",
        category: "Study",
        shortcut: ["3"],
        icon: <Target className="w-4 h-4 text-carbon-black" />,
        perform: () => {
          setActiveMode("retest");
        },
        keywords: ["retest", "weakness", "review", "remediation", "focus", "mistakes"],
      },
      {
        id: "action-new-deck",
        title: "Synthesize New Deck",
        description: "Reset active session and return to prompt input",
        category: "Actions",
        shortcut: ["⌘", "N"],
        icon: <RotateCcw className="w-4 h-4 text-carbon-black" />,
        perform: () => {
          reset();
          setActiveMode("study");
        },
        keywords: ["new", "create", "reset", "prompt", "generate", "start"],
      },
      {
        id: "action-history",
        title: "Open Session History",
        description: "Browse and restore previously generated decks",
        category: "Actions",
        shortcut: ["⌘", "H"],
        icon: <History className="w-4 h-4 text-carbon-black" />,
        perform: () => {
          setIsHistoryOpen(true);
        },
        keywords: ["history", "recent", "saved", "decks", "storage"],
      },
      {
        id: "action-export",
        title: "Export Active Deck",
        description: "Export current cards to Markdown or Anki TSV format",
        category: "Actions",
        shortcut: ["⌘", "E"],
        icon: <Share2 className="w-4 h-4 text-carbon-black" />,
        perform: () => {
          if (data) {
            setIsExportOpen(true);
          }
        },
        keywords: ["export", "anki", "tsv", "markdown", "download", "save"],
      },
      {
        id: "pref-sound",
        title: isMuted ? "Unmute Audio Effects" : "Mute Audio Effects",
        description: isMuted ? "Enable procedural Web Audio cues" : "Disable tactile Web Audio cues",
        category: "Preferences",
        icon: isMuted ? (
          <VolumeX className="w-4 h-4 text-smoke" />
        ) : (
          <Volume2 className="w-4 h-4 text-carbon-black" />
        ),
        perform: () => {
          handleToggleMute();
        },
        keywords: ["sound", "audio", "mute", "unmute", "volume", "effects"],
      },
      {
        id: "pref-shortcuts",
        title: "Keyboard Shortcuts Guide",
        description: "Display the hotkeys HUD legend",
        category: "Preferences",
        shortcut: ["?"],
        icon: <Keyboard className="w-4 h-4 text-carbon-black" />,
        perform: () => {
          setIsShortcutsOpen(true);
        },
        keywords: ["shortcuts", "hotkeys", "keybindings", "keyboard", "help"],
      },
    ];

    return actions;
  }, [data, isMuted, reset]);

  return (
    <div className="min-h-screen bg-warm-canvas text-carbon-black pb-24 px-4 sm:px-6">
      {/* Floating Top Navigation Pill Bar */}
      <header className="sticky top-4 sm:top-6 z-40 max-w-[1200px] mx-auto bg-paper-white border border-ash rounded-[48px] px-6 sm:px-8 py-3.5 flex items-center justify-between transition-all">
        {/* Brand Logo & Tag */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl bg-carbon-black text-paper-white flex items-center justify-center">
            <Brain className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base sm:text-lg tracking-tight uppercase text-carbon-black">
              SYNAPSE
            </span>
            <Badge variant="mint" size="sm" className="hidden sm:inline-flex">
              v2.4 // ACTIVE
            </Badge>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Targeted Remediation Mode Badge Trigger */}
          {totalWeakPoints > 0 && status === "success" && (
            <button
              type="button"
              onClick={() => setActiveMode(activeMode === "retest" ? "study" : "retest")}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[64px] bg-voltage-yellow text-carbon-black text-xs font-mono font-bold uppercase transition-colors cursor-pointer border border-carbon-black"
            >
              <Target className="w-3.5 h-3.5 animate-pulse text-carbon-black" />
              <span>
                Focus: {totalWeakPoints} {totalWeakPoints === 1 ? "item" : "items"}
              </span>
            </button>
          )}

          {/* Quick Command Palette Search Button */}
          <button
            type="button"
            onClick={() => setIsPaletteOpen(true)}
            className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-[48px] border border-ash bg-mist-gray hover:bg-ash/30 text-xs text-slate hover:text-carbon-black transition-all font-mono"
            title="Open Command Palette (⌘K)"
          >
            <Search className="h-3.5 w-3.5 text-smoke" />
            <span>Search</span>
            <Kbd keys={["⌘K"]} className="text-[10px] py-0 px-1.5 bg-paper-white text-carbon-black" />
          </button>

          {/* Audio Sound Effects Toggle */}
          <button
            type="button"
            onClick={handleToggleMute}
            aria-label={isMuted ? "Unmute audio effects" : "Mute audio effects"}
            title={isMuted ? "Audio muted (Click to enable sound)" : "Audio active (Click to mute)"}
            className={`p-2 rounded-full border transition-colors ${
              isMuted
                ? "border-ash text-smoke hover:text-carbon-black hover:bg-mist-gray"
                : "border-carbon-black bg-carbon-black text-paper-white hover:bg-carbon-black/80"
            }`}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>

          {/* History Drawer Trigger Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsHistoryOpen(true)}
            leftIcon={<History className="h-3.5 w-3.5" />}
            className="rounded-[48px] gap-1.5"
          >
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-mint-chip text-carbon-black font-mono text-[10px] font-bold">
                {historyCount}
              </span>
            )}
          </Button>

          {/* Export Deck Button (When active deck loaded) */}
          {status === "success" && data && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => setIsExportOpen(true)}
              leftIcon={<Share2 className="h-3.5 w-3.5" />}
              className="rounded-[48px]"
            >
              <span className="hidden sm:inline">Export</span>
            </Button>
          )}

          {/* Shortcuts HUD Button */}
          <button
            type="button"
            onClick={() => setIsShortcutsOpen(true)}
            aria-label="Keyboard Shortcuts"
            title="Keyboard Shortcuts (?)"
            className="p-2 rounded-full border border-ash bg-paper-white hover:bg-mist-gray text-slate hover:text-carbon-black transition-colors"
          >
            <Keyboard className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-[1200px] mx-auto pt-10 sm:pt-16 space-y-16 sm:space-y-20">
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
            {/* HERO SECTION — Editorial Brutalist Split Layout */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column: Massive Editorial Heading */}
              <div className="lg:col-span-6 space-y-6 pt-2">
                <div className="inline-flex items-center gap-2">
                  <Badge variant="mint" size="md">
                    ACTIVE RECALL // AI DECK SYNTHESIZER
                  </Badge>
                </div>

                <h1 className="text-5xl sm:text-7xl lg:text-[80px] font-extrabold tracking-tight uppercase leading-[0.9] text-carbon-black font-display">
                  ACTIVE RECALL. <br />
                  EVOLVED.
                </h1>

                <p className="text-slate text-base sm:text-lg leading-relaxed max-w-lg">
                  Transform raw knowledge into permanent memory. Paste notes, transcripts, or complex topics below. Synapse synthesizes high-retention 3D flashcards and pedagogical quiz assessments in seconds.
                </p>

                {/* Micro Keybindings hint */}
                <div className="flex items-center gap-3 pt-2 text-xs font-mono text-smoke">
                  <span className="flex items-center gap-1.5">
                    <Kbd keys={["⌘K"]} /> Command Palette
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Kbd keys={["?"]} /> Shortcuts HUD
                  </span>
                </div>
              </div>

              {/* Right Column: Brutalist Prompt Input Card */}
              <div className="lg:col-span-6">
                <PromptInput
                  onGenerate={handleGenerate}
                  onCancel={cancel}
                  isLoading={status === "loading"}
                />
              </div>
            </section>

            {/* Dynamic Workspace Container */}
            <section className="space-y-8">
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
                  <Card className="border border-ash bg-paper-white rounded-[32px] p-6 sm:p-8">
                    <CardHeader className="p-0 pb-6 border-b border-ash">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="mint" dot size="sm">
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
                          <CardTitle className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-carbon-black font-display">
                            {data.title}
                          </CardTitle>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setIsExportOpen(true)}
                            leftIcon={<Share2 className="h-3.5 w-3.5" />}
                          >
                            Export
                          </Button>
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
                      <CardDescription className="text-slate text-sm sm:text-base pt-3 leading-relaxed">
                        {data.summary}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="p-0 pt-6 space-y-6">
                      {/* Mode Tab Switcher & Weak Point Button */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ash pb-6">
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
                            className="border-carbon-black bg-voltage-yellow text-carbon-black hover:bg-voltage-yellow/90 gap-2 self-start sm:self-auto rounded-[64px]"
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
                      <div className="pt-4 border-t border-ash">
                        <button
                          type="button"
                          onClick={() => setRawPayloadOpen(!rawPayloadOpen)}
                          className="flex items-center justify-between w-full text-xs font-mono text-smoke hover:text-carbon-black py-2 transition-colors"
                        >
                          <span>[Developer Mode] Inspect Raw AI Response Payload</span>
                          {rawPayloadOpen ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>

                        {rawPayloadOpen && (
                          <pre className="mt-2 p-4 rounded-2xl bg-mist-gray border border-ash text-[11px] font-mono text-slate overflow-x-auto max-h-80 select-text">
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                  <div className="rounded-[32px] border border-ash bg-paper-white p-6 sm:p-8 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="h-10 w-10 rounded-2xl bg-carbon-black text-paper-white flex items-center justify-center">
                        <Layers className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-mono text-smoke font-bold">01 // CONCEPTS</span>
                    </div>
                    <h3 className="text-lg font-bold uppercase tracking-tight text-carbon-black">
                      Atomic Concept Flashcards
                    </h3>
                    <p className="text-sm text-slate leading-relaxed">
                      Extracts core themes into single-concept question-and-answer pairs with progressive hints and 3D flip physics.
                    </p>
                  </div>

                  <div className="rounded-[32px] border border-ash bg-paper-white p-6 sm:p-8 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="h-10 w-10 rounded-2xl bg-mint-chip text-carbon-black flex items-center justify-center">
                        <HelpCircle className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-mono text-smoke font-bold">02 // ASSESSMENT</span>
                    </div>
                    <h3 className="text-lg font-bold uppercase tracking-tight text-carbon-black">
                      4-Option Multiple Choice
                    </h3>
                    <p className="text-sm text-slate leading-relaxed">
                      Generates rigorous distractor options and pedagogical rationale explanations for deeper comprehension.
                    </p>
                  </div>

                  <div className="rounded-[32px] border border-ash bg-paper-white p-6 sm:p-8 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="h-10 w-10 rounded-2xl bg-voltage-yellow text-carbon-black flex items-center justify-center">
                        <Clock className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-mono text-smoke font-bold">03 // REMEDIATION</span>
                    </div>
                    <h3 className="text-lg font-bold uppercase tracking-tight text-carbon-black">
                      Weakness Remediation
                    </h3>
                    <p className="text-sm text-slate leading-relaxed">
                      Automatically isolates missed quiz items and flagged flashcards for focused re-testing until 100% mastery.
                    </p>
                  </div>
                </div>
              )}
            </section>
          </>
        )}
      </main>

      {/* History Drawer Modal */}
      <DeckHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        activeDeckId={data?.id || null}
        onSelectDeck={handleSelectHistoryDeck}
        onDeleteDeck={() => refreshHistoryCount()}
        onClearAll={() => refreshHistoryCount()}
      />

      {/* Deck Export Modal */}
      {data && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          deck={data}
        />
      )}

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        actions={commandActions}
      />

      {/* Keyboard Shortcuts HUD */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}

