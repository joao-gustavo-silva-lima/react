import { describe, expect, it } from "vitest";
import { type Link } from "../../types/links.types";
import { calculateMetrics } from "./Metrics";
import { getMockedLinks } from "../../utils/.test.utils";

describe("calculateMetrics", () => {
  const links: Link[] = getMockedLinks();

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
