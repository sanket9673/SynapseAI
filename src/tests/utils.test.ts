import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn() utility function", () => {
  it("merges standard class names correctly", () => {
    const result = cn("text-primary", "bg-surface");
    expect(result).toBe("text-primary bg-surface");
  });

  it("resolves conflicting Tailwind padding classes correctly", () => {
    // twMerge should override p-2 with p-4
    const result = cn("p-2", "p-4");
    expect(result).toBe("p-4");
  });

  it("handles conditional classes gracefully", () => {
    const isActive = true;
    const isFalse = false;
    const result = cn("base-class", isActive && "active-class", isFalse && "hidden-class");
    expect(result).toBe("base-class active-class");
  });
});
