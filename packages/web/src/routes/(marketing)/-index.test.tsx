// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LandingPage } from "#/components/landing-page";

describe("LandingPage", () => {
  it("presents the My EG Dentist tourism landing page", () => {
    render(<LandingPage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /dental care in egypt, planned before you fly/i,
      }),
    ).toBeTruthy();

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: /compare verified egyptian dentists/i,
      }),
    ).toBeTruthy();
    expect(screen.getByText(/save 50-70%/i)).toBeTruthy();
    expect(screen.getByText(/english-speaking coordination/i)).toBeTruthy();
    expect(screen.getByText(/airport, hotel, and clinic timing/i)).toBeTruthy();

    expect(
      screen.getByRole("link", { name: /find a dentist/i }).getAttribute("href"),
    ).toBe("/auth");
    expect(
      screen
        .getByRole("link", { name: /join as a clinic/i })
        .getAttribute("href"),
    ).toBe("/auth");
  });
});
