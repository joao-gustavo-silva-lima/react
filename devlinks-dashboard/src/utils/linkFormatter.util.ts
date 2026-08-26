import type { ModalFormData, ProtoLink } from "../types/links.types";

export function formDataToLinkPrototype(data: ModalFormData): ProtoLink {
  return {
    title: data.title.trim(),
    url: data.url.trim().toLowerCase(),
    category: data.category,
    tags: data.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
  };
}
