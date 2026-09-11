import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  Button,
  Badge,
  Textarea,
  Progress,
  Notice,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Skeleton,
  Kbd,
} from "@/components/ui";

describe("UI Primitives Component Suite", () => {
  describe("Button Component", () => {
    it("renders children and triggers onClick callback", () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click Me</Button>);

      const btn = screen.getByRole("button", { name: /click me/i });
      expect(btn).toBeInTheDocument();

      fireEvent.click(btn);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("applies variant classes properly", () => {
      const { rerender } = render(<Button variant="primary">Primary</Button>);
      expect(screen.getByRole("button")).toHaveClass("bg-accent-primary");

      rerender(<Button variant="secondary">Secondary</Button>);
      expect(screen.getByRole("button")).toHaveClass("bg-subtle");

      rerender(<Button variant="danger">Danger</Button>);
      expect(screen.getByRole("button")).toHaveClass("bg-error");

      rerender(<Button variant="outline">Outline</Button>);
      expect(screen.getByRole("button")).toHaveClass("border-border-bright");

      rerender(<Button variant="ghost">Ghost</Button>);
      expect(screen.getByRole("button")).toHaveClass("bg-transparent");
    });

    it("respects disabled state and prevents click interaction", () => {
      const handleClick = vi.fn();
      render(
        <Button disabled onClick={handleClick}>
          Disabled Button
        </Button>
      );

      const btn = screen.getByRole("button", { name: /disabled button/i });
      expect(btn).toBeDisabled();

      fireEvent.click(btn);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("enters aria-busy='true', disables interaction, and renders spinner when isLoading={true}", () => {
      const handleClick = vi.fn();
      render(
        <Button isLoading onClick={handleClick}>
          Submitting
        </Button>
      );

      const btn = screen.getByRole("button");
      expect(btn).toHaveAttribute("aria-busy", "true");
      expect(btn).toBeDisabled();
      expect(screen.getByTestId("button-spinner")).toBeInTheDocument();

      fireEvent.click(btn);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe("Badge Component", () => {
    it("renders variants and text content correctly", () => {
      const { rerender } = render(<Badge variant="accent">AI Active</Badge>);
      expect(screen.getByText("AI Active")).toHaveClass("text-accent-primary");

      rerender(<Badge variant="success">Completed</Badge>);
      expect(screen.getByText("Completed")).toHaveClass("text-success");

      rerender(<Badge variant="error">Failed</Badge>);
      expect(screen.getByText("Failed")).toHaveClass("text-error");

      rerender(<Badge variant="warning">Warning</Badge>);
      expect(screen.getByText("Warning")).toHaveClass("text-warning");
    });

    it("renders animated status dot when dot={true}", () => {
      render(
        <Badge variant="success" dot>
          Online
        </Badge>
      );

      expect(screen.getByTestId("badge-dot")).toBeInTheDocument();
      expect(screen.getByText("Online")).toBeInTheDocument();
    });
  });

  describe("Textarea Component", () => {
    it("renders placeholder and handles user input", () => {
      render(<Textarea placeholder="Type your answer here..." />);
      const textarea = screen.getByPlaceholderText("Type your answer here...");
      expect(textarea).toBeInTheDocument();
      expect(textarea).toHaveAttribute("aria-invalid", "false");
    });

    it("displays error message and binds aria-invalid='true'", () => {
      render(<Textarea error="Input cannot be empty" defaultValue="" />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("aria-invalid", "true");
      expect(screen.getByRole("alert")).toHaveTextContent("Input cannot be empty");
    });

    it("renders helper text and shortcut hint correctly", () => {
      render(
        <Textarea
          helperText="Maximum 500 words"
          shortcutHint="⌘ + Enter"
          placeholder="Answer"
        />
      );

      expect(screen.getByText("Maximum 500 words")).toBeInTheDocument();
      expect(screen.getByText("⌘ + Enter")).toBeInTheDocument();
    });
  });

  describe("Progress Component", () => {
    it("exposes correct ARIA attributes for accessibility", () => {
      render(<Progress value={65} />);
      const progress = screen.getByRole("progressbar");
      expect(progress).toHaveAttribute("aria-valuenow", "65");
      expect(progress).toHaveAttribute("aria-valuemin", "0");
      expect(progress).toHaveAttribute("aria-valuemax", "100");
    });

    it("clamps values outside the 0-100 range safely", () => {
      const { rerender } = render(<Progress value={120} />);
      let progress = screen.getByRole("progressbar");
      expect(progress).toHaveAttribute("aria-valuenow", "100");

      rerender(<Progress value={-20} />);
      progress = screen.getByRole("progressbar");
      expect(progress).toHaveAttribute("aria-valuenow", "0");
    });
  });

  describe("Notice Component", () => {
    it("renders title, children, and semantic icon", () => {
      render(
        <Notice variant="info" title="Spaced Repetition Active">
          Next review is scheduled for tomorrow at 9:00 AM.
        </Notice>
      );

      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByText("Spaced Repetition Active")).toBeInTheDocument();
      expect(
        screen.getByText("Next review is scheduled for tomorrow at 9:00 AM.")
      ).toBeInTheDocument();
      expect(screen.getByTestId("notice-icon")).toBeInTheDocument();
    });

    it("triggers onClose callback when close button is clicked", () => {
      const handleClose = vi.fn();
      render(
        <Notice variant="warning" title="Warning Note" onClose={handleClose}>
          Caution advised.
        </Notice>
      );

      const closeBtn = screen.getByRole("button", { name: /close notice/i });
      fireEvent.click(closeBtn);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("Card Compound Components", () => {
    it("renders complete compound hierarchy with title, description, content, and footer", () => {
      render(
        <Card glow data-testid="test-card">
          <CardHeader>
            <CardTitle>Neuroscience Deck</CardTitle>
            <CardDescription>42 active cards</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Frontier memory techniques.</p>
          </CardContent>
          <CardFooter>
            <Button size="sm">Start Session</Button>
          </CardFooter>
        </Card>
      );

      expect(screen.getByTestId("test-card")).toBeInTheDocument();
      expect(screen.getByText("Neuroscience Deck")).toBeInTheDocument();
      expect(screen.getByText("42 active cards")).toBeInTheDocument();
      expect(screen.getByText("Frontier memory techniques.")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /start session/i })).toBeInTheDocument();
    });
  });

  describe("Skeleton & Kbd Primitives", () => {
    it("renders Skeleton with animation class and variant", () => {
      const { container } = render(<Skeleton variant="circular" className="h-10 w-10" />);
      const skeletonEl = container.firstChild as HTMLElement;
      expect(skeletonEl).toHaveClass("animate-shimmer");
      expect(skeletonEl).toHaveClass("rounded-full");
    });

    it("renders Kbd with keys array", () => {
      render(<Kbd keys={["⌘", "Shift", "P"]} />);
      expect(screen.getByText("⌘")).toBeInTheDocument();
      expect(screen.getByText("Shift")).toBeInTheDocument();
      expect(screen.getByText("P")).toBeInTheDocument();
    });
  });
});
