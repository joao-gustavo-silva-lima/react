import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import SearchBar from "./SearchBar";
import type { Query } from "../../types/links.types";

afterEach(() => {
  cleanup();
});

describe("SearchBar Component", () => {
  it("should change the title filter query when user types the text input", async () => {
    const user = userEvent.setup();
    const setFilterQuery = vi.fn();

    render(<SearchBar filterQuery={{}} setFilterQuery={setFilterQuery} />);

    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();

    await user.type(input, "DoCs");

    expect(setFilterQuery).toHaveBeenLastCalledWith(
      expect.objectContaining({
        title: "DoCs",
      }),
    );
  });

  it("should change the category filter query when user clicks a dropdown's option", async () => {
    const user = userEvent.setup();
    const setFilterQuery = vi.fn();

    render(<SearchBar filterQuery={{}} setFilterQuery={setFilterQuery} />);

    const lsButton = screen.getByRole("button", { name: /categorias/i });
    expect(lsButton).toBeInTheDocument();

    expect(
      screen.queryByRole("list", { hidden: false }),
    ).not.toBeInTheDocument();

    await user.click(lsButton);

    const list = screen.getByRole("list", { hidden: false });
    expect(list).toBeInTheDocument();

    const option = within(list).getByRole("button", {
      name: /documentação/i,
    });
    expect(option).toBeInTheDocument();

    await user.click(option);

    expect(setFilterQuery).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        category: expect.stringMatching(/documentação/i),
      } as Query),
    );
  });
});
