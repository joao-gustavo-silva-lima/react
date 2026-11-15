import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { getMockedLinks } from "../../utils/.test.utils";
import LinkList, { filterLinks, type LinkListProps } from "./LinkList";
import type { Query } from "../../types/links.types";

afterEach(() => {
  cleanup();
});

const renderLinkList = (props: Partial<LinkListProps>) => {
  const overwrittenProps = {
    links: [],
    filterQuery: {},
    isQuerying: false,
    hasQueryFailed: false,
    openRegisterModal: () => {},
    openUpdatingModal: () => {},
    setFilterQuery: () => {},
    refetchLinks: () => {},
    ...props,
  } as LinkListProps;

  render(<LinkList {...overwrittenProps} />);
};

describe("LinkList Component", () => {
  it("should render loading skeletons while fetching links", () => {
    renderLinkList({
      isQuerying: true,
    });

    const loadingSkeletons = screen.getAllByRole("listitem");

    loadingSkeletons.forEach((element) => {
      expect(element).toBeInTheDocument();
      expect(element.textContent.trim()).toBeFalsy();
    });
  });

  it("should render an alert within a page refresh link for when links fetching has failed", () => {
    renderLinkList({
      hasQueryFailed: true,
    });

    const alert = screen.getByText(/erro ao buscar os links/i);
    const link = within(alert).getByRole("link");

    expect(alert).toBeInTheDocument();
    expect(link).toBeInTheDocument();
    expect(link.getAttribute("href")).toBe("/");
  });

  it("should render an alert within a button for opening the link register modal when there are no fetched links", async () => {
    renderLinkList({});

    const alert = screen.getByText(/não há links registrados/i);
    const button = within(alert).getByRole("button", { name: /registrar/i });

    expect(alert).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it("should render an alert within a button for cleaning the filter when the current query matches no links", async () => {
    renderLinkList({
      links: getMockedLinks(),
      filterQuery: {
        title: "non-existent-link",
        category: "unknown-category",
      },
    });

    const alert = screen.getByText(
      /nenhum link satisfaz os filtros aplicados/i,
    );
    const button = within(alert).getByRole("button", {
      name: /limpar filtros/i,
    });

    expect(alert).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it.for([
    {},
    {
      category: "desenvolvimento",
    },
    { title: "docs" },
  ] as Query[])(
    "should render link cards satisfying query when fetching is successfully done",
    (query) => {
      const links = getMockedLinks();
      const filteredLinks = filterLinks(links, query);
      const nonMatchingLinks = links.filter(
        (link) => !filteredLinks.includes(link),
      );

      renderLinkList({
        links,
        filterQuery: query,
      });

      nonMatchingLinks.forEach(({ title }) => {
        expect(
          screen.queryByText(new RegExp(title, "i")),
        ).not.toBeInTheDocument();
      });
      filteredLinks.forEach(({ title }) => {
        expect(screen.getByText(new RegExp(title, "i"))).toBeInTheDocument();
      });
    },
  );
});
