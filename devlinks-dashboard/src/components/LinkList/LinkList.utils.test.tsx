import { describe, expect, it } from "vitest";
import { getMockedLinks } from "../../utils/.test.utils";
import { filterLinks } from "./LinkList";

describe("filterLinks", () => {
  const links = getMockedLinks();

  it("should return an empty list when there are no links", () => {
    expect(filterLinks([], {})).toEqual([]);
  });

  it("should return all links when no filters are applied", () => {
    expect(filterLinks(links, {})).toEqual(links);
  });

  it("should return links whose title contains the query, ignoring letter case", () => {
    const filteredLinks = filterLinks(links, { title: "dOcS" });

    expect(filteredLinks.map(({ id }) => id)).toEqual(["1", "2"]);
  });

  it("should return links in the requested category, ignoring letter case", () => {
    const filteredLinks = filterLinks(links, {
      category: "DESENVOLVIMENTO",
    });

    expect(filteredLinks.map(({ id }) => id)).toEqual(["1", "2"]);
  });

  it("should return links that include the requested tag", () => {
    const filteredLinks = filterLinks(links, { tag: "typescript" });

    expect(filteredLinks.map(({ id }) => id)).toEqual(["2"]);
  });

  it("should treat empty filter values as unapplied filters", () => {
    const filteredLinks = filterLinks(links, {
      title: "",
      category: "",
      tag: "",
    });

    expect(filteredLinks).toEqual(links);
  });

  it("should return only links that match every applied filter", () => {
    const filteredLinks = filterLinks(links, {
      title: "docs",
      category: "desenvolvimento",
      tag: "typescript",
    });

    expect(filteredLinks.map(({ id }) => id)).toEqual(["2"]);
  });

  it("should return an empty list when no link matches all applied filters", () => {
    const filteredLinks = filterLinks(links, {
      title: "React",
      category: "design",
    });

    expect(filteredLinks).toEqual([]);
  });
});
