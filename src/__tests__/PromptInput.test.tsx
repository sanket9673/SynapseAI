import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PromptInput } from "@/components/prompt/PromptInput";

describe("PromptInput Component", () => {
  it("renders textarea, sample topic pills, and submit button", () => {
    const onGenerate = vi.fn();
    const onCancel = vi.fn();

    render(<PromptInput onGenerate={onGenerate} onCancel={onCancel} isLoading={false} />);

    expect(
      screen.getByPlaceholderText(/Paste your raw lecture notes/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Quantum Superposition & Qubits/i)).toBeInTheDocument();
    expect(screen.getByText(/JavaScript Event Loop & Microtasks/i)).toBeInTheDocument();
    expect(screen.getByText(/Cellular Respiration/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Generate Study Set/i })).toBeInTheDocument();
  });

  it("updates character counter as user types and enables button when length >= 10", () => {
    const onGenerate = vi.fn();
    const onCancel = vi.fn();

    render(<PromptInput onGenerate={onGenerate} onCancel={onCancel} isLoading={false} />);

    const textarea = screen.getByPlaceholderText(/Paste your raw lecture notes/i);
    const submitBtn = screen.getByRole("button", { name: /Generate Study Set/i });

    // Initially disabled because length is 0 (< 10)
    expect(submitBtn).toBeDisabled();

    // Type 5 chars (too short)
    fireEvent.change(textarea, { target: { value: "Hello" } });
    expect(screen.getByText(/Minimum 10 characters required/i)).toBeInTheDocument();
    expect(submitBtn).toBeDisabled();

    // Type valid text >= 10 chars
    fireEvent.change(textarea, {
      target: { value: "Photosynthesis converts light into biochemical energy." },
    });
    expect(submitBtn).not.toBeDisabled();

    fireEvent.click(submitBtn);
    expect(onGenerate).toHaveBeenCalledTimes(1);
    expect(onGenerate).toHaveBeenCalledWith(
      "Photosynthesis converts light into biochemical energy.",
      { mockMode: false }
    );
  });

  it("populates textarea when clicking a sample topic pill", () => {
    const onGenerate = vi.fn();
    const onCancel = vi.fn();

    render(<PromptInput onGenerate={onGenerate} onCancel={onCancel} isLoading={false} />);

    const pill = screen.getByText(/JavaScript Event Loop & Microtasks/i);
    fireEvent.click(pill);

    const textarea = screen.getByPlaceholderText(
      /Paste your raw lecture notes/i
    ) as HTMLTextAreaElement;

    expect(textarea.value).toContain("single-threaded event loop concurrency model");

    const submitBtn = screen.getByRole("button", { name: /Generate Study Set/i });
    expect(submitBtn).not.toBeDisabled();
  });

  it("supports keyboard shortcut (Meta+Enter / Ctrl+Enter) to submit", () => {
    const onGenerate = vi.fn();
    const onCancel = vi.fn();

    render(<PromptInput onGenerate={onGenerate} onCancel={onCancel} isLoading={false} />);

    const textarea = screen.getByPlaceholderText(/Paste your raw lecture notes/i);
    fireEvent.change(textarea, {
      target: { value: "Valid prompt notes for keyboard shortcut verification." },
    });

    // Fire Cmd+Enter
    fireEvent.keyDown(textarea, { key: "Enter", metaKey: true });
    expect(onGenerate).toHaveBeenCalledTimes(1);

    // Fire Ctrl+Enter
    fireEvent.keyDown(textarea, { key: "Enter", ctrlKey: true });
    expect(onGenerate).toHaveBeenCalledTimes(2);
  });

  it("toggles mock mode correctly", () => {
    const onGenerate = vi.fn();
    const onCancel = vi.fn();

    render(<PromptInput onGenerate={onGenerate} onCancel={onCancel} isLoading={false} />);

    const mockToggleBtn = screen.getByTitle(/Toggle offline simulated AI inference/i);
    expect(mockToggleBtn).toBeInTheDocument();
    expect(screen.getByText("OFF")).toBeInTheDocument();

    // Click mock toggle
    fireEvent.click(mockToggleBtn);
    expect(screen.getByText("ON")).toBeInTheDocument();

    const textarea = screen.getByPlaceholderText(/Paste your raw lecture notes/i);
    fireEvent.change(textarea, {
      target: { value: "Valid mock prompt text notes exceeding ten chars." },
    });

    const submitBtn = screen.getByRole("button", { name: /Generate Study Set/i });
    fireEvent.click(submitBtn);

    expect(onGenerate).toHaveBeenCalledWith(
      "Valid mock prompt text notes exceeding ten chars.",
      { mockMode: true }
    );
  });

  it("swaps submit button to cancel button during loading state", () => {
    const onGenerate = vi.fn();
    const onCancel = vi.fn();

    render(
      <PromptInput
        onGenerate={onGenerate}
        onCancel={onCancel}
        isLoading={true}
        initialValue="Some in-flight text content..."
      />
    );

    const cancelBtn = screen.getByRole("button", { name: /Cancel Generation/i });
    expect(cancelBtn).toBeInTheDocument();

    fireEvent.click(cancelBtn);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("clears text when clicking clear button", () => {
    const onGenerate = vi.fn();
    const onCancel = vi.fn();

    render(
      <PromptInput
        onGenerate={onGenerate}
        onCancel={onCancel}
        isLoading={false}
        initialValue="Some existing text notes"
      />
    );

    const clearBtn = screen.getByRole("button", { name: /Clear/i });
    fireEvent.click(clearBtn);

    const textarea = screen.getByPlaceholderText(
      /Paste your raw lecture notes/i
    ) as HTMLTextAreaElement;
    expect(textarea.value).toBe("");
  });
});
