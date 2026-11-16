import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PREDEFINED_CATEGORIES } from "../../types/links.types";
import CategorySelect from "./CategorySelect";

afterEach(() => {
  cleanup();
});

describe("CategorySelect Component", () => {
  it("should display the dropdown when the category button receives focus", async () => {
    const user = userEvent.setup();

    render(<CategorySelect changeCategory={() => {}} />);

    const button = screen.getByRole("button", { name: /categoria/i });
    expect(button).toBeInTheDocument();

    expect(
      screen.queryByRole("list", { hidden: false }),
    ).not.toBeInTheDocument();

    await user.click(button);

    const list = screen.getByRole("list", { hidden: false });
    expect(list).toBeInTheDocument();

    PREDEFINED_CATEGORIES.forEach((category) => {
      expect(
        within(list).getByRole("button", { name: category }),
      ).toBeInTheDocument();
    });
  });

  it("should call the category change function when the user selects an option", async () => {
    const user = userEvent.setup();
    const changeCategory = vi.fn();

    render(
      <CategorySelect
        changeCategory={changeCategory}
        placeholder="Todas as Categorias"
      />,
    );

    await user.click(
      screen.getByRole("button", { name: /todas as categorias/i }),
    );

    const option = screen.getByRole("button", {
      name: /documentação/i,
    });
    expect(option).toBeInTheDocument();

    await user.click(option);

    expect(changeCategory).toHaveBeenCalledExactlyOnceWith("documentação");
  });

  it("should validate the input and close the dropdown when the category button loses focus", async () => {
    const user = userEvent.setup();
    const validateInput = vi.fn();

    render(
      <>
        <CategorySelect
          changeCategory={() => {}}
          validateInput={validateInput}
        />
        <button type="button">Outro botão</button>
      </>,
    );

    await user.click(screen.getByRole("button", { name: /categoria/i }));

    expect(screen.getByRole("list", { hidden: false })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /outro botão/i }));

    expect(validateInput).toHaveBeenCalledOnce();
    expect(
      screen.queryByRole("list", { hidden: false }),
    ).not.toBeInTheDocument();
  });
});
