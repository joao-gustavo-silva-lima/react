import type { LinkInput, LinkUpdateInput } from "../schemas/Link.schema";
import request from "./request.api";

export function createLink(payload: LinkInput) {
  return request("/link", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
}

export function fetchLinks() {
  return request("/link", {
    credentials: "include",
  });
}

export function fetchLink(id: number) {
  return request(`/link/${encodeURIComponent(id)}`, {
    credentials: "include",
  });
}

export function updateLink(id: number, payload: LinkUpdateInput) {
  return request(`/link/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
}

export function deleteLink(id: number) {
  return request(`/link/${encodeURIComponent(id)}`, {
    method: "DELETE",
    credentials: "include",
  });
}
