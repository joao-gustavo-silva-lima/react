import { cleanup, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { Link } from "../types/links.types";
import Metrics from "./Metrics";

beforeEach(() => {
  cleanup();
});

describe("Metrics Component", () => {
  const links: Link[] = [
    {
      id: "1",
      title: "React Docs",
      url: "https://react.dev",
      category: "desenvolvimento",
      tags: ["react"],
      clicks: 5,
      createdAt: "2026-01-15",
    },
    {
      id: "2",
      title: "TypeScript Docs",
      url: "https://www.typescriptlang.org",
      category: "desenvolvimento",
      tags: ["typescript"],
      clicks: 3,
      createdAt: "2026-01-16",
    },
    {
      id: "3",
      title: "Design System",
      url: "https://example.com/design",
      category: "design",
      tags: [],
      clicks: 1,
      createdAt: "2026-01-17",
    },
  ];

  it("should render loading skeletons when isQuerying is true", () => {
    render(<Metrics links={[]} isQuerying={true} />);

    expect(
      screen
        .getAllByRole("listitem")
        .every(({ textContent }) => !Boolean(textContent.trim())),
    ).toBeTruthy();
  });

  it("should render correct metrics when links are provided", () => {
    render(<Metrics links={links} isQuerying={false} />);

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
