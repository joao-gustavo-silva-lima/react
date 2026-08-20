import { useState } from "react";
import {
  EXPECTED_FORM_INPUT_IDS,
  modalFormDataSchema,
  type ModalFormData,
  type ProtoLink,
} from "../types/links.types";
import LinksAPI from "../api/links.api";

export default function useModal() {
  const [inputErrors, setInputErrors] = useState<Record<string, string>>({});
  const [isRegistering, setIsRegistering] = useState(false);
  const [generalMessage, setGeneralMessage] = useState<string>();

  async function submit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isRegistering) return false;

    const formData = catchFormData(e.currentTarget);
    const newInputErrors = catchInputErrors(formData);

    setInputErrors(newInputErrors);

    if (Object.keys(newInputErrors).length > 0) {
      return false;
    }

    const linkPrototype = formDataToLinkPrototype(formData as ModalFormData);

    setIsRegistering(true);

    const res = await LinksAPI.registerLink(linkPrototype);

    setIsRegistering(false);

    setGeneralMessage(undefined);

    if (res.ok) {
      setGeneralMessage("O link foi criado com sucesso.");
      return true;
    }

    switch (res.status) {
      case 400:
        setGeneralMessage(
          "A formatação do formulário é inválida. Contate o suporte.",
        );
        break;

      case 409:
        setInputErrors({ url: "Um link já foi registrado com essa URL." });
        break;

      case 500:
        setGeneralMessage(
          "Um erro interno do servidor ocorreu. Tente novamente em instantes.",
        );
        break;
    }

    return false;
  }

  return { isRegistering, generalMessage, inputErrors: inputErrors, submit };
}

function catchFormData(form: EventTarget & HTMLFormElement) {
  const formData = new FormData(form);

  return Object.fromEntries(formData.entries());
}

function catchInputErrors(data: { [k: string]: FormDataEntryValue }) {
  const newErrors: Record<string, string> = {};
  const validation = modalFormDataSchema.safeParse(data);

  validation.error?.issues.forEach(({ path, message }) => {
    const inputID = path[0] ?? "unexpectedError";

    if (EXPECTED_FORM_INPUT_IDS.includes(inputID as any)) {
      newErrors[inputID as keyof ModalFormData] = message;
    }
  });

  return newErrors;
}

function formDataToLinkPrototype(data: ModalFormData): ProtoLink {
  const { title, url, category, tags } = data as Required<ModalFormData>;

  const linkPrototype: ProtoLink = {
    title: title.trim(),
    url: url.trim(),
    category: category,
    tags: tags.trim().split(/,\s*/),
  };

  return linkPrototype;
}
