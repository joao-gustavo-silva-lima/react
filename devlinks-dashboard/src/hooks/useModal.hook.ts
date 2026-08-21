import { useState } from "react";
import {
  EXPECTED_FORM_INPUT_IDS,
  modalFormDataSchema,
  type Link,
  type ModalFormData,
  type ProtoLink,
} from "../types/links.types";
import LinksAPI from "../api/links.api";
import type z from "zod";

export default function useModal(links: Link[]) {
  const [inputErrors, setInputErrors] = useState<Record<string, string>>({});
  const [isRegistering, setIsRegistering] = useState(false);
  const [generalMessage, setGeneralMessage] = useState<string>();

  async function submit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isRegistering) return false;

    setInputErrors({});
    setGeneralMessage(undefined);

    const formDataRaw = Object.fromEntries(new FormData(e.currentTarget));
    const validation = modalFormDataSchema.safeParse(formDataRaw);

    if (!validation.success) {
      const errors = parseZodErrors(validation.error.issues);
      setInputErrors(errors);
      return false;
    }

    if (links.some((link) => link.url === formDataRaw["url"])) {
      setInputErrors({ url: "A URL já foi registrada anteriormente." });
      return false;
    }

    const linkPrototype = formDataToLinkPrototype(validation.data);

    setIsRegistering(true);

    try {
      const res = await LinksAPI.registerLink(linkPrototype);

      if (res.ok) {
        setGeneralMessage("O link foi criado com sucesso.");
        return true;
      }

      switch (res.status) {
        case 409:
          setInputErrors({ url: "A URL já foi registrada anteriormente." });
          break;
        case 400:
          setGeneralMessage("A formatação do formulário é inválida.");
          break;
        default:
          setGeneralMessage(
            "Ocorreu um erro no servidor. Tente novamente em instantes.",
          );
      }

      return false;
    } catch {
      setGeneralMessage("Um erro de rede ocorreu. Tente novamente mais tarde.");
      return false;
    } finally {
      setIsRegistering(false);
    }
  }

  return { isRegistering, generalMessage, inputErrors, submit };
}

function parseZodErrors(issues: z.core.$ZodIssue[]) {
  const newErrors: Record<string, string> = {};

  for (const issue of issues) {
    const inputID = String(issue.path[0] ?? "");

    if (EXPECTED_FORM_INPUT_IDS.includes(inputID as any)) {
      newErrors[inputID] = issue.message;
    }
  }

  return newErrors;
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
