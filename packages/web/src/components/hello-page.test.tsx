// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HelloPage } from "./hello-page";

describe("HelloPage", () => {
  it("prints Hello World", () => {
    render(<HelloPage />);

    expect(screen.getByRole("heading", { name: "Hello World!" })).toBeTruthy();
  });
});
