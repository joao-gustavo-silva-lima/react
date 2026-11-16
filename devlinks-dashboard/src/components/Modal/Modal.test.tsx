import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Link } from "../../types/links.types";
import { getMockedLinks } from "../../utils/.test.utils";
import Modal from "./Modal";

afterEach(() => {
  cleanup();
});

const mockLink: Link = getMockedLinks()[0];

describe("Modal Component", () => {
  it("should not render when disabled", () => {
    render(
      <Modal
        enabled={false}
        updatingLink={undefined}
        refetchLinks={() => {}}
        setEnabled={() => {}}
        stopUpdating={() => {}}
      />,
    );

    expect(
      screen.queryByRole("form", { name: /formulário/i }),
    ).not.toBeInTheDocument();
  });

  it("should render the register form when enabled", () => {
    render(
      <Modal
        enabled={true}
        updatingLink={undefined}
        refetchLinks={() => {}}
        setEnabled={() => {}}
        stopUpdating={() => {}}
      />,
    );

    expect(
      screen.queryByRole("form", { name: /formulário/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/registrar novo link/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/título/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/url/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /categoria/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/tags/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /registrar/i }),
    ).toBeInTheDocument();
  });

  it("should render the update form with the current link data", () => {
    render(
      <Modal
        enabled={true}
        updatingLink={mockLink}
        refetchLinks={() => {}}
        setEnabled={() => {}}
        stopUpdating={() => {}}
      />,
    );

    expect(screen.getByText(/atualizar link/i)).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(new RegExp(mockLink.title, "i")),
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(new RegExp(mockLink.url, "i")),
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(new RegExp(mockLink.category, "i")),
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /tags/i })).toHaveValue(
      mockLink.tags.join(", "),
    );
    expect(
      screen.getByRole("button", { name: /atualizar/i }),
    ).toBeInTheDocument();
  });

  it("should display validation errors after trying to submit an empty form", async () => {
    const user = userEvent.setup();

    render(
      <Modal
        enabled={true}
        updatingLink={undefined}
        refetchLinks={() => {}}
        setEnabled={() => {}}
        stopUpdating={() => {}}
      />,
    );

    await user.click(screen.getByRole("button", { name: /registrar/i }));

    expect(screen.getByText(/o título é obrigatório\./i)).toBeInTheDocument();
    expect(
      screen.getByText(/a url de destino é obrigatória\./i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/selecione uma categoria válida para o link\./i),
    ).toBeInTheDocument();
  });

  it("should close the modal when cancel is clicked", async () => {
    const user = userEvent.setup();
    const setEnabled = vi.fn();
    const stopUpdating = vi.fn();

    render(
      <Modal
        enabled={true}
        updatingLink={mockLink}
        refetchLinks={() => {}}
        setEnabled={setEnabled}
        stopUpdating={stopUpdating}
      />,
    );

    await user.click(screen.getByRole("button", { name: /cancelar/i }));

    expect(stopUpdating).toHaveBeenCalledTimes(1);
    expect(setEnabled).toHaveBeenCalledWith(false);
  });
});
