import { formDataToLinkPrototype } from "../utils/linkFormatter.util";
import { type ModalFormData } from "../types/links.types";
import LinksAPI from "../api/links.api";
import { useState } from "react";

export default function useLinkMutation() {
  const [isMutating, setIsMutating] = useState(false);

  async function handleLinkMutation(
    apiCall: () => Promise<Response>,
    successMessage: string,
  ) {
    setIsMutating(true);

    try {
      const res = await apiCall();

      return {
        success: res.ok,
        message: res.ok ? successMessage : interpretResponseStatus(res.status),
      };
    } catch {
      return {
        success: false,
        message: "Ocorreu um erro de rede. Cheque a conexão.",
      };
    } finally {
      setIsMutating(false);
    }
  }

  async function registerLink(formData: ModalFormData) {
    const linkPrototype = formDataToLinkPrototype(formData);

    return handleLinkMutation(
      () => LinksAPI.registerLink(linkPrototype),
      "O link foi registrado com sucesso.",
    );
  }

  async function updateLinkByID(id: string, formData: ModalFormData) {
    const linkPrototype = formDataToLinkPrototype(formData);

    return handleLinkMutation(
      () => LinksAPI.updateLinkByID(id, linkPrototype),
      "O link foi atualizado com sucesso.",
    );
  }

  async function deleteLinkByID(id: string) {
    return handleLinkMutation(
      () => LinksAPI.deleteLinkByID(id),
      "O link foi excluído com sucesso.",
    );
  }

  async function redirectByLinkID(id: string) {
    return handleLinkMutation(
      () => LinksAPI.deleteLinkByID(id),
      "Você será redirecionado.",
    );
  }

  function interpretResponseStatus(status: number) {
    switch (status) {
      case 400:
        return "A formatação do formulário é inválida.";
      case 404:
        return "O link não foi reconhecido no servidor.";
      case 409:
        return "A URL já está sendo utilizada por outro link.";
      default:
        return "Ocorreu um erro no servidor. Tente novamente em instantes.";
    }
  }

  return {
    isMutating,
    registerLink,
    updateLinkByID,
    deleteLinkByID,
    redirectByLinkID,
  };
}
