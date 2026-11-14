import type { ProtoLink, Query } from "../types/links.types";

const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL;

if (API_BASE_URL === undefined) {
  throw new Error("MISSING_API_BASE_URL_ENV_VAR");
}

export default class LinksAPI {
  public static fetchLinks(query: Query = {}) {
    const urlQuery = new URLSearchParams(query);

    return fetch(`${API_BASE_URL}?${urlQuery.toString()}`);
  }

  public static registerLink(linkPrototype: ProtoLink) {
    return fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(linkPrototype),
    });
  }

  public static fetchLinkByID(ID: string) {
    return fetch(`${API_BASE_URL}/${ID}`);
  }

  public static deleteLinkByID(ID: string) {
    return fetch(`${API_BASE_URL}/${ID}`, {
      method: "DELETE",
    });
  }

  public static updateLinkByID(ID: string, linkPrototype: ProtoLink) {
    return fetch(`${API_BASE_URL}/${ID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(linkPrototype),
    });
  }

  public static redirectByLinkID(ID: string) {
    return fetch(`${API_BASE_URL}/${ID}/redirect`);
  }
}
