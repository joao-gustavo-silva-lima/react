import { useState } from "react";
import { type FormData, type Link, type ProtoLink } from "../types/links.types";
import LinksAPI from "../api/links.api";

export default function useLinkMutation() {
  const [isMutating, setIsMutating] = useState(false);
  const [conflictingURLs, setConflictingURLs] = useState<string[]>([]);
  const [notFoundIDs, setNotFoundIDs] = useState<string[]>([]);

  async function mutate(formData: FormData, updatingLink?: Link) {
    const linkPrototype = formDataToLinkPrototype(formData);

    if (!checkCachedConflicts(linkPrototype, updatingLink)) {
      return false;
    }

    setIsMutating(true);

    try {
      const res = await (updatingLink
        ? LinksAPI.updateUniqueLink(updatingLink.id, linkPrototype)
        : LinksAPI.registerLink(linkPrototype));

      if (res.ok) {
        alert(
          `O link foi ${updatingLink ? "atualizado" : "registrado"} com sucesso.`,
        );
        return true;
      }

      switch (res.status) {
        case 400:
          alert("A formatação do formulário é inválida.");
          break;
        case 404:
          handleNotFoundIDs(updatingLink!.id);
          break;
        case 409:
          handleConflictingURLs(linkPrototype.url);
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

  function clearCachedConflicts() {
    setConflictingURLs([]);
    setNotFoundIDs([]);
  }

  function checkCachedConflicts(linkPrototype: ProtoLink, updatingLink?: Link) {
    if (updatingLink && notFoundIDs.includes(updatingLink.id)) {
      return false;
    }

    if (
      linkPrototype.url !== updatingLink?.url &&
      conflictingURLs.includes(linkPrototype.url)
    ) {
      handleConflictingURLs(linkPrototype.url);
      return false;
    }

    return true;
  }

  function handleConflictingURLs(newUrl: string) {
    alert("Um link já foi registrado com essa URL.");
    setConflictingURLs((prevURLs) => [newUrl, ...prevURLs]);
  }

  function handleNotFoundIDs(newID: string) {
    alert("O link não foi reconhecido no servidor. Recarregue a página.");
    setNotFoundIDs((prevIDs) => [newID, ...prevIDs]);
  }

  return {
    isMutating,
    register: (formData: FormData) => mutate(formData),
    update: (updatingLink: Link, formData: FormData) =>
      mutate(formData, updatingLink),
    clearCachedConflicts,
  };
}

function formDataToLinkPrototype(data: FormData): ProtoLink {
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
