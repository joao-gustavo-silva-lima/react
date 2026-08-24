import { useState } from "react";
import { type ModalFormData, type ProtoLink } from "../types/links.types";
import LinksAPI from "../api/links.api";

export default function useLinkMutation() {
  const [isMutating, setIsMutating] = useState(false);
  const [conflictingURLs, setConflictingURLs] = useState<string[]>([]);

  const register = (formData: ModalFormData) => mutate(formData);
  const update = (formData: ModalFormData, id: string) => mutate(formData, id);

  async function mutate(formData: ModalFormData, id?: string) {
    const linkPrototype = formDataToLinkPrototype(formData);

    if (conflictingURLs.includes(linkPrototype.url)) {
      handleConflictingURLs(linkPrototype.url);
      return false;
    }

    setIsMutating(true);

    try {
      const res = await (id
        ? LinksAPI.updateUniqueLink(id, linkPrototype)
        : LinksAPI.registerLink(linkPrototype));

      if (res.ok) {
        alert(`O link foi ${id ? "atualizado" : "registrado"} com sucesso.`);
        return true;
      }

      switch (res.status) {
        case 409:
          handleConflictingURLs(linkPrototype.url);
          break;
        case 400:
          alert("A formatação do formulário é inválida.");
          break;
        default:
          alert("Ocorreu um erro no servidor. Tente novamente em instantes.");
      }

      return false;
    } catch {
      alert("Um erro de rede ocorreu. Cheque a conexão.");
      return false;
    } finally {
      setIsMutating(false);
    }
  }

  function handleConflictingURLs(newUrl: string) {
    alert("Um link já foi registrado com essa URL.");
    setConflictingURLs((prevURLs) => [newUrl, ...prevURLs]);
  }

  return { isMutating, register, update };
}

function formDataToLinkPrototype(data: ModalFormData): ProtoLink {
  return {
    title: data.title.trim(),
    url: data.url.trim(),
    category: data.category,
    tags: data.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
  };
}
