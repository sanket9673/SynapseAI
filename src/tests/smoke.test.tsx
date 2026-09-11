import { render, screen } from "@testing-library/react";
import Home from "@/app/page";
import { describe, it, expect } from "vitest";

describe("Smoke Test - App Canvas", () => {
  it("renders the design system showcase and title successfully", () => {
    render(<Home />);
    
    const title = screen.getByText(/Accessible UI Design System/i);
    expect(title).toBeInTheDocument();

    const brand = screen.getByText("SYNAPSE");
    expect(brand).toBeInTheDocument();
  });

  it("evaluates basic math and string checks", () => {
    expect(2 + 2).toBe(4);
    expect("synapse".toUpperCase()).toBe("SYNAPSE");
  });
});
