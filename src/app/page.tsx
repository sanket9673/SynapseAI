"use client";

import * as React from "react";
import {
  Sparkles,
  Zap,
  ArrowRight,
  Brain,
  Search,
  BookOpen,
  Check,
  RefreshCw,
  Sliders,
  Send,
  Bell,
  Trash2,
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
  Textarea,
  Progress,
  Skeleton,
  Kbd,
  Notice,
} from "@/components/ui";

export default function ShowcasePage() {
  const [btnLoading, setBtnLoading] = React.useState(false);
  const [progressVal, setProgressVal] = React.useState(68);
  const [textareaValue, setTextareaValue] = React.useState("");
  const [showError, setShowError] = React.useState(false);
  const [activeNotices, setActiveNotices] = React.useState({
    info: true,
    success: true,
    warning: true,
    error: true,
  });

  return (
    <div className="min-h-screen bg-app text-text-primary selection:bg-accent-primary/30 selection:text-white pb-24">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-app/80 border-b border-border-dim px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-accent-primary to-indigo-400 flex items-center justify-center shadow-glow">
            <Brain className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base tracking-tight text-white">
                SYNAPSE
              </span>
              <Badge variant="accent" size="sm" dot>
                DS v1.0
              </Badge>
            </div>
            <p className="text-[11px] text-text-tertiary font-mono hidden sm:block">
              AI Active Recall Engine // Design System & Primitives
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Kbd keys={["⌘", "K"]} />
          <Button
            size="sm"
            variant="outline"
            leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
            onClick={() => {
              setBtnLoading(true);
              setTimeout(() => setBtnLoading(false), 2000);
            }}
          >
            Simulate Load
          </Button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 space-y-12">
        {/* Hero Section */}
        <section className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-subtle border border-border-dim text-xs font-mono text-accent-primary">
            <Sparkles className="h-3.5 w-3.5 text-accent-primary" />
            <span>FLAM AI Study System Core Primitives</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-text-primary">
            Accessible UI Design System
          </h1>
          <p className="text-text-secondary text-sm sm:text-base max-w-3xl leading-relaxed">
            Engineered to Linear/Vercel fidelity standards. Strictly typed, accessible with full ARIA semantics, zero layout shift, dark-canvas optimized tokens, and micro-interactions.
          </p>
        </section>

        {/* 1. BUTTONS SECTION */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border-dim pb-3">
            <div>
              <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                1. Button Primitive
              </h2>
              <p className="text-xs text-text-secondary">
                Variants, sizes, icon composition, and non-shifting loading states with ARIA busy attributes.
              </p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setBtnLoading(!btnLoading)}
            >
              Toggle Loading: <span className="ml-1 font-mono text-accent-primary">{btnLoading ? "ON" : "OFF"}</span>
            </Button>
          </div>

          {/* Variants Grid */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Variants Matrix</CardTitle>
              <CardDescription>Primary, Secondary, Outline, Ghost, and Danger actions</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-3">
              <Button variant="primary" isLoading={btnLoading} leftIcon={<Zap className="h-4 w-4" />}>
                Primary Action
              </Button>
              <Button variant="secondary" isLoading={btnLoading} leftIcon={<BookOpen className="h-4 w-4" />}>
                Secondary
              </Button>
              <Button variant="outline" isLoading={btnLoading}>
                Outline Action
              </Button>
              <Button variant="ghost" isLoading={btnLoading}>
                Ghost Action
              </Button>
              <Button variant="danger" isLoading={btnLoading} leftIcon={<Trash2 className="h-4 w-4" />}>
                Danger Action
              </Button>
              <Button variant="primary" disabled>
                Disabled
              </Button>
            </CardContent>
          </Card>

          {/* Sizes Grid */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Sizes Hierarchy</CardTitle>
              <CardDescription>sm (32px), md (40px), lg (48px), and icon (40px square)</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-3">
              <Button size="sm" variant="secondary" leftIcon={<Search className="h-3.5 w-3.5" />}>
                Small (sm)
              </Button>
              <Button size="md" variant="secondary" leftIcon={<Search className="h-4 w-4" />}>
                Medium (md)
              </Button>
              <Button size="lg" variant="secondary" rightIcon={<ArrowRight className="h-5 w-5" />}>
                Large (lg)
              </Button>
              <Button size="icon" variant="secondary" aria-label="Search">
                <Search className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="primary" aria-label="Settings">
                <Sliders className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* 2. CARDS & GLOW SECTION */}
        <section className="space-y-4">
          <div className="border-b border-border-dim pb-3">
            <h2 className="text-lg font-semibold text-text-primary">
              2. Compound Card Primitive
            </h2>
            <p className="text-xs text-text-secondary">
              Composable hierarchy (`CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`) with optional indigo ambient glow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Standard Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Standard Elevation</CardTitle>
                  <Badge variant="neutral">Default</Badge>
                </div>
                <CardDescription>Border dim with subtle elevation shadow.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-text-secondary leading-relaxed">
                  Engineered for consistent background contrast across dark themes. Supports nested cards and clean layout compartmentalization.
                </p>
                <div className="p-3 rounded-lg bg-subtle/60 border border-border-dim flex items-center justify-between text-xs">
                  <span className="text-text-secondary">Active Retention Rate</span>
                  <span className="font-mono text-success font-semibold">94.2%</span>
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <span className="text-xs text-text-tertiary font-mono">ID: DECK-902</span>
                <Button size="sm" variant="ghost">Dismiss</Button>
              </CardFooter>
            </Card>

            {/* Glowing Card */}
            <Card glow>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-accent-primary" />
                    Ambient Glow Card
                  </CardTitle>
                  <Badge variant="accent" dot>Featured</Badge>
                </div>
                <CardDescription>Indigo drop-shadow (`glow=true`) for focused state.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-text-secondary leading-relaxed">
                  Highlights high-priority AI insights, active recall recommendations, or live sessions.
                </p>
                <div className="p-3 rounded-lg bg-accent-subtle/30 border border-accent-primary/30 flex items-center justify-between text-xs">
                  <span className="text-accent-primary font-medium">Smart Question Generation</span>
                  <Badge variant="accent" size="sm">Groq Llama-3 Ready</Badge>
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <span className="text-xs text-accent-primary font-mono">Active Focus</span>
                <Button size="sm" variant="primary" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                  Start Review
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* 3. BADGES & KEYBOARDS */}
        <section className="space-y-4">
          <div className="border-b border-border-dim pb-3">
            <h2 className="text-lg font-semibold text-text-primary">
              3. Badges & Keyboard Shortcut Primitives
            </h2>
            <p className="text-xs text-text-secondary">
              Status tags with pulsing indicators and monospace kbd elements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Badges */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Status Badges</CardTitle>
                <CardDescription>Variants with live status dot animations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="neutral">neutral</Badge>
                  <Badge variant="accent">accent</Badge>
                  <Badge variant="success">success</Badge>
                  <Badge variant="warning">warning</Badge>
                  <Badge variant="error">error</Badge>
                  <Badge variant="outline">outline</Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border-dim">
                  <Badge variant="neutral" dot size="sm">Idle</Badge>
                  <Badge variant="accent" dot size="sm">AI Processing</Badge>
                  <Badge variant="success" dot size="sm">Synced</Badge>
                  <Badge variant="warning" dot size="sm">Due Soon</Badge>
                  <Badge variant="error" dot size="sm">Critical</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Kbd shortcuts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Kbd Shortcut Pills</CardTitle>
                <CardDescription>Raised border depth and monospace typography</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-subtle/40 border border-border-dim">
                  <span className="text-xs text-text-secondary">Quick Search Engine</span>
                  <Kbd keys={["⌘", "K"]} />
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-subtle/40 border border-border-dim">
                  <span className="text-xs text-text-secondary">Submit Active Recall Answer</span>
                  <Kbd keys={["⌘", "Enter"]} />
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-subtle/40 border border-border-dim">
                  <span className="text-xs text-text-secondary">Toggle Focus Matrix</span>
                  <Kbd keys={["Ctrl", "Shift", "P"]} />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 4. TEXTAREA PRIMITIVE */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border-dim pb-3">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                4. Textarea Primitive
              </h2>
              <p className="text-xs text-text-secondary">
                Accessible input with helper text, error bindings (`aria-invalid`), and shortcut hint badges.
              </p>
            </div>
            <Button
              size="sm"
              variant={showError ? "danger" : "outline"}
              onClick={() => setShowError(!showError)}
            >
              Toggle Error: {showError ? "Simulated Error ON" : "Normal"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Interactive Recall Textarea</CardTitle>
                <CardDescription>Active recall response input field with inline shortcut</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={textareaValue}
                  onChange={(e) => setTextareaValue(e.target.value)}
                  placeholder="Explain the process of long-term potentiation in your own words..."
                  helperText={!showError ? "Try to explain without looking at notes to maximize retention." : undefined}
                  error={showError ? "Answer cannot be blank or contain fewer than 10 characters." : undefined}
                  shortcutHint="⌘ + Enter"
                  rows={4}
                />
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-text-tertiary font-mono">
                    Characters: {textareaValue.length}
                  </span>
                  <Button
                    size="sm"
                    variant="primary"
                    disabled={textareaValue.trim().length === 0}
                    rightIcon={<Send className="h-3.5 w-3.5" />}
                  >
                    Submit for AI Evaluation
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Disabled / Pre-filled State</CardTitle>
                <CardDescription>Immutable view for graded evaluation responses</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  disabled
                  defaultValue="Long-term potentiation (LTP) is a persistent strengthening of synapses based on recent patterns of activity. These are patterns of synaptic activity that produce a long-lasting increase in signal transmission between two neurons."
                  helperText="Graded response locked for review"
                  rows={4}
                />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 5. PROGRESS & SKELETON LOADERS */}
        <section className="space-y-4">
          <div className="border-b border-border-dim pb-3">
            <h2 className="text-lg font-semibold text-text-primary">
              5. Progress Bar & Skeleton Loaders
            </h2>
            <p className="text-xs text-text-secondary">
              Radix-backed accessible progress bars and shimmer gradient skeletons.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Progress */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Accessible Progress</CardTitle>
                  <span className="font-mono text-xs text-accent-primary font-bold">
                    {progressVal}%
                  </span>
                </div>
                <CardDescription>ARIA compliant (role=&quot;progressbar&quot;) with smooth transitions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-text-secondary">
                    <span>Deck Mastery</span>
                    <span>{progressVal}% Complete</span>
                  </div>
                  <Progress value={progressVal} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-text-secondary">
                    <span>AI Knowledge Accuracy</span>
                    <span className="text-success font-medium">92%</span>
                  </div>
                  <Progress value={92} indicatorColor="bg-success" />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setProgressVal((v) => Math.max(0, v - 15))}
                  >
                    - 15%
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setProgressVal((v) => Math.min(100, v + 15))}
                  >
                    + 15%
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setProgressVal(100)}
                  >
                    Complete (100%)
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Skeleton Shimmer */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Shimmer Skeletons</CardTitle>
                  <Badge variant="accent" size="sm">2s infinite</Badge>
                </div>
                <CardDescription>Continuous linear gradient animation for loading layouts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Skeleton variant="circular" className="h-10 w-10 shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton variant="text" className="h-4 w-3/4" />
                    <Skeleton variant="text" className="h-3 w-1/2" />
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-border-dim">
                  <Skeleton variant="rectangular" className="h-16 w-full" />
                  <div className="grid grid-cols-3 gap-2">
                    <Skeleton variant="rectangular" className="h-8" />
                    <Skeleton variant="rectangular" className="h-8" />
                    <Skeleton variant="rectangular" className="h-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 6. NOTICE PRIMITIVES */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border-dim pb-3">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                6. Notice / Alert Primitive
              </h2>
              <p className="text-xs text-text-secondary">
                Semantic contextual alerts (`info`, `success`, `warning`, `error`) with action slots and dismiss handlers.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                setActiveNotices({ info: true, success: true, warning: true, error: true })
              }
            >
              Reset Notices
            </Button>
          </div>

          <div className="space-y-3">
            {activeNotices.info && (
              <Notice
                variant="info"
                title="Spaced Repetition Algorithm Synchronized"
                onClose={() => setActiveNotices((s) => ({ ...s, info: false }))}
                action={
                  <Button size="sm" variant="outline">
                    View Schedule
                  </Button>
                }
              >
                FSRS scheduling model has updated your review queues based on optimal forgetting curve parameters.
              </Notice>
            )}

            {activeNotices.success && (
              <Notice
                variant="success"
                title="Active Recall Session Mastered"
                onClose={() => setActiveNotices((s) => ({ ...s, success: false }))}
              >
                All 24 flashcard concept questions were evaluated with an average confidence score of 96%.
              </Notice>
            )}

            {activeNotices.warning && (
              <Notice
                variant="warning"
                title="Memory Decay Alert"
                onClose={() => setActiveNotices((s) => ({ ...s, warning: false }))}
                action={
                  <Button size="sm" variant="secondary">
                    Review 5 Overdue Cards
                  </Button>
                }
              >
                5 concepts in &ldquo;Cellular Respiration&rdquo; are predicted to drop below the 80% recall threshold within 12 hours.
              </Notice>
            )}

            {activeNotices.error && (
              <Notice
                variant="error"
                title="Groq API Rate Limit Exceeded"
                onClose={() => setActiveNotices((s) => ({ ...s, error: false }))}
                action={
                  <Button size="sm" variant="danger">
                    Retry Request
                  </Button>
                }
              >
                Unable to synthesize study prompt. Falling back to local heuristic cache.
              </Notice>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
