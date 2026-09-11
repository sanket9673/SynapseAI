import { render, screen } from "@testing-library/react";
import Home from "@/app/page";
import { describe, it, expect } from "vitest";

describe("Smoke Test - App Canvas", () => {
  it("renders the Synapse header and prompt input successfully", () => {
    render(<Home />);
    
    const brand = screen.getByText("SYNAPSE");
    expect(brand).toBeInTheDocument();

    const hero = screen.getByText(/Transform Raw Knowledge into Permanent Memory/i);
    expect(hero).toBeInTheDocument();

    const textarea = screen.getByPlaceholderText(/Paste your raw lecture notes/i);
    expect(textarea).toBeInTheDocument();
  });

  it("evaluates basic math and string checks", () => {
    expect(2 + 2).toBe(4);
    expect("synapse".toUpperCase()).toBe("SYNAPSE");
  });
});
