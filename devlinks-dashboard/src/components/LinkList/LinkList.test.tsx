import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Query } from "../../types/links.types";
import { getMockedLinks } from "../../utils/.test.utils";
import LinkList, { type LinkListProps } from "./LinkList";

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

  it("should render an alert within a button that opens the link register modal when clicked, when there are no fetched links", async () => {
    const user = userEvent.setup();
    const openRegisterModal = vi.fn();

    renderLinkList({
      openRegisterModal,
    });

    const alert = screen.getByText(/não há links registrados/i);
    expect(alert).toBeInTheDocument();

    const button = within(alert).getByRole("button", { name: /registrar/i });
    expect(button).toBeInTheDocument();

    await user.click(button);

    expect(openRegisterModal).toHaveBeenCalledOnce();
  });

  it("should render an alert within a button thats cleans the filter when clicked, when no links match the current query", async () => {
    const user = userEvent.setup();
    const setFilterQuery = vi.fn();

    renderLinkList({
      links: getMockedLinks(),
      filterQuery: {
        title: "non-existent-link",
        category: "unknown-category",
      },
      setFilterQuery,
    });

    const alert = screen.getByText(
      /nenhum link satisfaz os filtros aplicados/i,
    );
    expect(alert).toBeInTheDocument();

    const button = within(alert).getByRole("button", {
      name: /limpar filtros/i,
    });
    expect(button).toBeInTheDocument();

    await user.click(button);

    expect(setFilterQuery).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({}),
    );
  });

  it("should render link cards when links fetching is successfull", () => {
    const links = getMockedLinks();

    renderLinkList({
      links,
    });

    links.forEach(({ title }) => {
      expect(screen.getByText(new RegExp(title, "i"))).toBeInTheDocument();
    });
  });

  it("should render link cards respecting the category filter", () => {
    const links = getMockedLinks();

    renderLinkList({
      links,
      filterQuery: { category: "desenvolvimento" },
    });

    expect(screen.queryByText(/design/i)).not.toBeInTheDocument();
    expect(screen.getAllByText(/desenvolvimento/i)).toHaveLength(2);
  });

  it("should render link cards respecting the title filter", () => {
    const links = getMockedLinks();

    renderLinkList({
      links,
      filterQuery: { title: "docs" },
    });

    expect(screen.queryByText(/design/i)).not.toBeInTheDocument();
    expect(screen.getAllByText(/docs/i)).toHaveLength(2);
  });

  it("should call the category filter change function when link card's category button is clicked", async () => {
    const user = userEvent.setup();
    const setFilterQuery = vi.fn();

    renderLinkList({
      links: getMockedLinks(),
      setFilterQuery,
    });

    const button = screen.getByRole("button", { name: /design/i });
    expect(button).toBeInTheDocument();

    await user.click(button);

    expect(setFilterQuery).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        category: expect.stringMatching(/design/i),
      } as Query),
    );
  });
});
