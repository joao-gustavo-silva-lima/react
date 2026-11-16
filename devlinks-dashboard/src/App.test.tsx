import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import type { Link, ProtoLink } from "./types/links.types";
import { getMockedLinks } from "./utils/.test.utils";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

beforeEach(() => {
  vi.stubGlobal("alert", vi.fn());
});

function mockLinksAPI(inputLinks: Link[] = getMockedLinks()) {
  let links = inputLinks.map((link) => ({ ...link }));
  let nextID = Math.max(...links.map(({ id }) => Number(id)), 0) + 1;

  const apiPath = new URL(
    import.meta.env.VITE_API_BASE_URL,
    window.location.origin,
  ).pathname.replace(/\/$/, "");

  const fetchMock = vi.fn(
    async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const requestURL = new URL(String(input), window.location.origin);
      const endpoint = requestURL.pathname
        .slice(apiPath.length)
        .replace(/^\/|\/$/g, "");
      const method = init?.method ?? "GET";

      if (method === "GET" && endpoint === "") {
        return createResponse(links);
      }

      if (method === "POST") {
        const prototype = JSON.parse(String(init?.body)) as ProtoLink;
        links = [
          ...links,
          {
            ...prototype,
            id: String(nextID++),
            category: prototype.category ?? "",
            tags: prototype.tags ?? [],
            clicks: 0,
            createdAt: "2026-01-18",
          },
        ];

        return createResponse(links, 201);
      }

      if (method === "PUT") {
        const prototype = JSON.parse(String(init?.body)) as ProtoLink;
        links = links.map((link) =>
          link.id === endpoint ? { ...link, ...prototype } : link,
        );
        return createResponse(links, 200);
      }

      if (method === "DELETE") {
        links = links.filter((link) => link.id !== endpoint);
        return createResponse(links, 204);
      }

      if (method === "GET" && endpoint.endsWith("/redirect")) {
        return createResponse({ redirectURL: "https://react.dev" });
      }

      return createResponse(null, 404);
    },
  );

  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

function createResponse(data: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
  } as Response;
}

function getLinkCard(title: string) {
  const titleElement = screen.getByText(title);
  const card = titleElement.closest("li");

  if (!card) {
    throw new Error(`Could not find link card for "${title}"`);
  }

  return card;
}

describe("App integration", () => {
  it("fetches links, displays metrics, and filters links by title and category", async () => {
    const user = userEvent.setup();
    const fetchMock = mockLinksAPI();

    render(<App />);

    expect(await screen.findByText("React Docs")).toBeInTheDocument();
    expect(screen.getByText("TypeScript Docs")).toBeInTheDocument();
    expect(screen.getByText("Design System")).toBeInTheDocument();
    expect(
      screen.getByText(/desenvolvimento \(2 links\)/i),
    ).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledWith(expect.stringMatching(/\?$/));

    const searchInput = screen.getByPlaceholderText("Pesquisar links...");
    await user.type(searchInput, "react");

    expect(screen.getByText("React Docs")).toBeInTheDocument();
    expect(screen.queryByText("TypeScript Docs")).not.toBeInTheDocument();
    expect(screen.queryByText("Design System")).not.toBeInTheDocument();

    await user.clear(searchInput);

    const categoryInputButton = screen.getByRole("button", {
      name: /todas as categorias/i,
    });
    const categoryInput = categoryInputButton.closest("div")!;

    await user.click(categoryInputButton);
    await user.click(
      within(categoryInput).getByRole("button", { name: "design" }),
    );

    expect(screen.getByText("Design System")).toBeInTheDocument();
    expect(screen.queryByText("React Docs")).not.toBeInTheDocument();
    expect(screen.queryByText("TypeScript Docs")).not.toBeInTheDocument();
  });

  it("registers a link and refreshes the displayed list", async () => {
    const user = userEvent.setup();
    const fetchMock = mockLinksAPI([]);

    render(<App />);

    await user.click(
      await screen.findByRole("button", { name: /registrar um novo/i }),
    );

    const form = screen.getByRole("form", { name: /formulário/i });
    expect(form).toBeInTheDocument();

    await user.type(within(form).getByLabelText(/título/i), "Meu Novo Link");
    await user.type(
      within(form).getByLabelText(/url/i),
      "https://example.com/resource",
    );
    await user.click(within(form).getByRole("button", { name: /categoria/i }));
    await user.click(
      within(form).getByRole("button", { name: /documentação/i }),
    );
    await user.type(within(form).getByLabelText(/tags/i), "React, Typescript");
    await user.click(within(form).getByRole("button", { name: /registrar/i }));

    expect(
      screen.queryByRole("form", { name: /formulário/i }),
    ).not.toBeInTheDocument();
    expect(await screen.findByText("Meu Novo Link")).toBeInTheDocument();

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      expect.any(String),
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Meu Novo Link",
          url: "https://example.com/resource",
          category: "documentação",
          tags: ["react", "typescript"],
        }),
      }),
    );
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock).toHaveBeenNthCalledWith(3, expect.stringMatching(/\?$/));
  });

  it("updates a link and refreshes its card", async () => {
    const user = userEvent.setup();
    const fetchMock = mockLinksAPI();

    render(<App />);

    await screen.findByText("React Docs");
    const card = getLinkCard("React Docs");
    await user.click(within(card).getByRole("button", { name: "edit" }));

    const titleInput = screen.getByLabelText(/título/i);
    await user.clear(titleInput);
    await user.type(titleInput, "React Documentation");
    await user.click(screen.getByRole("button", { name: /^atualizar$/i }));

    expect(await screen.findByText("React Documentation")).toBeInTheDocument();
    expect(screen.queryByText("React Docs")).not.toBeInTheDocument();
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      expect.stringMatching(/\/1$/),
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify({
          title: "React Documentation",
          url: "https://react.dev",
          category: "desenvolvimento",
          tags: ["react"],
        }),
      }),
    );
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("deletes a link after confirmation and refreshes the list", async () => {
    const user = userEvent.setup();
    const fetchMock = mockLinksAPI();
    const confirmMock = vi.fn(() => true);
    vi.stubGlobal("confirm", confirmMock);

    render(<App />);

    await screen.findByText("React Docs");
    const card = getLinkCard("React Docs");
    await user.click(within(card).getAllByRole("button")[3]);

    await waitFor(() => {
      expect(screen.queryByText("React Docs")).not.toBeInTheDocument();
    });

    expect(confirmMock).toHaveBeenCalledWith(
      'Deseja excluir o link "React Docs"?',
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      expect.stringMatching(/\/1$/),
      { method: "DELETE" },
    );
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("redirects to the API-provided URL after user confirmation", async () => {
    const user = userEvent.setup();
    const fetchMock = mockLinksAPI();
    const confirmMock = vi.fn(() => true);
    const openMock = vi.fn();
    vi.stubGlobal("confirm", confirmMock);
    vi.stubGlobal("open", openMock);

    render(<App />);

    await screen.findByText("React Docs");
    const card = getLinkCard("React Docs");
    await user.click(within(card).getByRole("button", { name: /acessar/i }));

    await waitFor(() => {
      expect(openMock).toHaveBeenCalledWith("https://react.dev", "_blank");
    });

    expect(confirmMock).toHaveBeenCalledWith(
      "Deseja abrir 'https://react.dev' em uma nova aba?",
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      expect.stringMatching(/\/1\/redirect$/),
    );
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });
});
