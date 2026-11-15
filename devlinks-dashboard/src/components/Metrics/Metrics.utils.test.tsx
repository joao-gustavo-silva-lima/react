import { describe, expect, it } from "vitest";
import { Link } from "../../types/links.types";
import { calculateMetrics } from "./Metrics";

describe("calculateMetrics", () => {
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

  it("should correctly calculate metrics for zero or undefined for empty link list", () => {
    const metrics = calculateMetrics([]);

    expect(metrics.numOfLinks).toBe(0);
    expect(metrics.numOfClicks).toBe(0);
    expect(metrics.popularCategory).toBeUndefined();
  });

  it("should correctly calculate metrics for total links, clicks and popular category", () => {
    const metrics = calculateMetrics(links);

    expect(metrics.numOfLinks).toBe(3);
    expect(metrics.numOfClicks).toBe(9);
    expect(metrics.popularCategory!.name).toBe("desenvolvimento");
    expect(metrics.popularCategory!.numOfLinks).toBe(2);
  });
});
