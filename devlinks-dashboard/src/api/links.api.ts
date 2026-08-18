import type { ProtoLink, Query } from "../types/links.types";

const API_BASE_URL = "http://localhost:5000/api/v1/links";

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

  public static fetchUniqueLink(ID: string) {
    return fetch(`${API_BASE_URL}/${ID}`);
  }

  public static deleteUniqueLink(ID: string) {
    return fetch(`${API_BASE_URL}/${ID}`, {
      method: "DELETE",
    });
  }

  public static updateUniqueLink(ID: string, linkPrototype: ProtoLink) {
    return fetch(`${API_BASE_URL}/${ID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(linkPrototype),
    });
  }

  public static redirectByUniqueLink(ID: string) {
    return fetch(`${API_BASE_URL}/${ID}/redirect`);
  }
}
