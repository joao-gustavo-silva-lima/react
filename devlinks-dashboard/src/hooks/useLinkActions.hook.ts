import { formDataToLinkPrototype } from "../utils/linkFormatter.util";
import { type ModalFormData } from "../types/links.types";
import LinksAPI from "../api/links.api";
import { useState } from "react";

type ActionReturn<ResolveData = unknown> = Promise<{
  success: boolean;
  message: string;
  data?: ResolveData;
}>;

export default function useLinkAction() {
  const [isActing, setIsActing] = useState(false);

  async function handleLinkAction(
    apiCall: () => Promise<Response>,
    successMessage: string,
    acceptData = false,
  ): ActionReturn {
    setIsActing(true);

    try {
      const res = await apiCall();

      return {
        success: res.ok,
        message: res.ok ? successMessage : interpretResponseStatus(res.status),
        data: res.ok && acceptData && (await res.json()),
      };
    } catch {
      return {
        success: false,
        message: "Ocorreu um erro de rede. Cheque a conexão.",
      };
    } finally {
      setIsActing(false);
    }
  }

  async function registerLink(formData: ModalFormData) {
    const linkPrototype = formDataToLinkPrototype(formData);

    return handleLinkAction(
      () => LinksAPI.registerLink(linkPrototype),
      "O link foi registrado com sucesso.",
    );
  }

  async function updateLinkByID(id: string, formData: ModalFormData) {
    const linkPrototype = formDataToLinkPrototype(formData);

    return handleLinkAction(
      () => LinksAPI.updateLinkByID(id, linkPrototype),
      "O link foi atualizado com sucesso.",
    );
  }

  async function deleteLinkByID(id: string) {
    return handleLinkAction(
      () => LinksAPI.deleteLinkByID(id),
      "O link foi excluído com sucesso.",
    );
  }

  async function redirectByLinkID(id: string) {
    return handleLinkAction(
      () => LinksAPI.redirectByLinkID(id),
      "Você será redirecionado.",
      true,
    ) as ActionReturn<{ redirectURL: string }>;
  }

  return {
    isActing,
    registerLink,
    updateLinkByID,
    deleteLinkByID,
    redirectByLinkID,
  };
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
