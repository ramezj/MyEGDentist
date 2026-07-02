// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { LandingPage } from "./-landing-page";

afterEach(() => {
  cleanup();
});

describe("LandingPage", () => {
  it("introduces My EG Dentist as a dental tourism landing page", () => {
    render(<LandingPage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /dental care in egypt, planned before you fly/i,
      }),
    ).not.toBeNull();
    expect(
      screen.getByText(
        /my eg dentist helps international patients compare trusted egyptian clinics/i,
      ),
    ).not.toBeNull();
    expect(
      screen.getByRole("link", { name: /find a dentist/i }).getAttribute("href"),
    ).toBe("#clinics");
    expect(
      screen.getByRole("link", { name: /start a booking/i }).getAttribute("href"),
    ).toBe("/bookings");
  });

  it("shows the patient journey and trust cues", () => {
    render(<LandingPage />);

    expect(screen.getByText("Compare verified clinics")).not.toBeNull();
    expect(screen.getByText("Plan treatment remotely")).not.toBeNull();
    expect(screen.getByText("Arrive with a care plan")).not.toBeNull();
    expect(screen.getByText("English-speaking coordination")).not.toBeNull();
    expect(screen.getByText("Transparent treatment estimates")).not.toBeNull();
  });
});
