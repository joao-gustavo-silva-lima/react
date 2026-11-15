import { cleanup, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { getMockedLinks } from "../../utils/.test.utils";
import Metrics from "./Metrics";

beforeEach(() => {
  cleanup();
});

describe("Metrics Component", () => {
  it("should render loading skeletons when isQuerying is true", () => {
    render(<Metrics links={[]} isQuerying={true} />);

    expect(
      screen
        .getAllByRole("listitem")
        .every(({ textContent }) => !Boolean(textContent.trim())),
    ).toBeTruthy();
  });

  it("should render correct metrics when links are provided", () => {
    render(<Metrics links={getMockedLinks()} isQuerying={false} />);

    expect(screen.getByText(/total de links/i)).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();

    expect(screen.getByText(/total de clicks/i)).toBeInTheDocument();
    expect(screen.getByText("9")).toBeInTheDocument();

    expect(screen.getByText(/categoria popular/i)).toBeInTheDocument();
    expect(
      screen.getByText(/desenvolvimento \(2 links\)/i),
    ).toBeInTheDocument();
  });

  it("should not render popular category metric when list is empty", () => {
    render(<Metrics links={[]} isQuerying={false} />);

    expect(screen.getByText(/total de links/i)).toBeInTheDocument();
    expect(screen.getByText(/total de clicks/i)).toBeInTheDocument();
    expect(screen.queryByText(/categoria popular/i)).not.toBeInTheDocument();
  });
});
