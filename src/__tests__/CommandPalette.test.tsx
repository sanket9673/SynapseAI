import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CommandPalette } from "@/components/palette/CommandPalette";
import { ShortcutsModal } from "@/components/palette/ShortcutsModal";
import type { CommandAction } from "@/types/palette";
import { Layers, HelpCircle, Target, RotateCcw } from "lucide-react";

describe("CommandPalette & ShortcutsModal Component Suite", () => {
  const mockPerform1 = vi.fn();
  const mockPerform2 = vi.fn();
  const mockPerform3 = vi.fn();
  const mockPerform4 = vi.fn();
  const mockClose = vi.fn();

  const sampleActions: CommandAction[] = [
    {
      id: "action-flashcards",
      title: "Study Flashcards",
      description: "Switch to 3D active recall flashcard deck",
      category: "Navigation",
      shortcut: ["1"],
      icon: <Layers data-testid="icon-flashcards" className="w-4 h-4" />,
      perform: mockPerform1,
      keywords: ["cards", "flip", "study"],
    },
    {
      id: "action-quiz",
      title: "Practice Quiz",
      description: "Switch to 4-option assessment",
      category: "Navigation",
      shortcut: ["2"],
      icon: <HelpCircle data-testid="icon-quiz" className="w-4 h-4" />,
      perform: mockPerform2,
      keywords: ["test", "quiz", "questions"],
    },
    {
      id: "action-retest",
      title: "Targeted Remediation Mode",
      description: "Isolate missed quiz questions",
      category: "Study",
      shortcut: ["3"],
      icon: <Target data-testid="icon-retest" className="w-4 h-4" />,
      perform: mockPerform3,
      keywords: ["weakness", "review"],
    },
    {
      id: "action-reset",
      title: "Synthesize New Deck",
      description: "Reset active session",
      category: "Actions",
      shortcut: ["⌘", "N"],
      icon: <RotateCcw data-testid="icon-reset" className="w-4 h-4" />,
      perform: mockPerform4,
      keywords: ["new", "reset", "prompt"],
    },
  ];

  it("does not render when isOpen is false", () => {
    const { container } = render(
      <CommandPalette isOpen={false} onClose={mockClose} actions={sampleActions} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders search input, category headers, and all actions when isOpen is true", () => {
    render(<CommandPalette isOpen={true} onClose={mockClose} actions={sampleActions} />);

    expect(screen.getByPlaceholderText(/Type a command or search/i)).toBeInTheDocument();
    expect(screen.getAllByText("Navigation").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Study").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Actions").length).toBeGreaterThan(0);
    expect(screen.getByText("Study Flashcards")).toBeInTheDocument();
    expect(screen.getByText("Practice Quiz")).toBeInTheDocument();
  });

  it("filters actions based on search input matching title and keywords", () => {
    render(<CommandPalette isOpen={true} onClose={mockClose} actions={sampleActions} />);

    const searchInput = screen.getByPlaceholderText(/Type a command or search/i);

    // Search by keyword "flip"
    fireEvent.change(searchInput, { target: { value: "flip" } });
    expect(screen.getByText("Study Flashcards")).toBeInTheDocument();
    expect(screen.queryByText("Practice Quiz")).not.toBeInTheDocument();

    // Search by title "Quiz"
    fireEvent.change(searchInput, { target: { value: "Quiz" } });
    expect(screen.getByText("Practice Quiz")).toBeInTheDocument();
    expect(screen.queryByText("Study Flashcards")).not.toBeInTheDocument();

    // Search for non-existent term
    fireEvent.change(searchInput, { target: { value: "xyznonexistent" } });
    expect(screen.getByText(/No matching actions found/i)).toBeInTheDocument();
  });

  it("supports keyboard navigation with ArrowDown, ArrowUp, and Enter", () => {
    render(<CommandPalette isOpen={true} onClose={mockClose} actions={sampleActions} />);

    const searchInput = screen.getByPlaceholderText(/Type a command or search.../i);

    // Initial selected index is 0 (Study Flashcards)
    // Press ArrowDown to navigate to index 1 (Practice Quiz)
    fireEvent.keyDown(searchInput, { key: "ArrowDown" });
    // Press Enter to execute selected item
    fireEvent.keyDown(searchInput, { key: "Enter" });

    expect(mockPerform2).toHaveBeenCalledTimes(1);
    expect(mockClose).toHaveBeenCalled();
  });

  it("executes perform callback and closes when an item is clicked", () => {
    render(<CommandPalette isOpen={true} onClose={mockClose} actions={sampleActions} />);

    const actionItem = screen.getByText("Synthesize New Deck");
    fireEvent.click(actionItem);

    expect(mockPerform4).toHaveBeenCalledTimes(1);
    expect(mockClose).toHaveBeenCalled();
  });

  it("calls onClose when Escape key is pressed", () => {
    render(<CommandPalette isOpen={true} onClose={mockClose} actions={sampleActions} />);

    const searchInput = screen.getByPlaceholderText(/Type a command or search.../i);
    fireEvent.keyDown(searchInput, { key: "Escape" });

    expect(mockClose).toHaveBeenCalled();
  });

  it("renders ShortcutsModal and groups shortcuts by Global, Flashcards, and Quiz", () => {
    const handleCloseShortcuts = vi.fn();
    render(<ShortcutsModal isOpen={true} onClose={handleCloseShortcuts} />);

    expect(screen.getByText("Keyboard Shortcuts Reference")).toBeInTheDocument();
    expect(screen.getByText("Global Commands")).toBeInTheDocument();
    expect(screen.getByText("3D Flashcard Deck")).toBeInTheDocument();
    expect(screen.getByText("Interactive Quiz Engine")).toBeInTheDocument();
    expect(screen.getByText("Open Command Palette")).toBeInTheDocument();

    // Close button
    const closeBtn = screen.getByRole("button", { name: /Close shortcuts modal/i });
    fireEvent.click(closeBtn);
    expect(handleCloseShortcuts).toHaveBeenCalled();
  });
});
