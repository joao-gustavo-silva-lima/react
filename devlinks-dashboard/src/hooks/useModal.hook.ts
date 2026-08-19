import { useCallback, useState } from "react";
import {
  PREDEFINED_CATEGORIES,
  type LinkCategories,
  type ModalFormData,
  type ProtoLink,
} from "../types/links.types";

type Errors = Partial<Record<keyof ModalFormData, string>>;

export default function useModal() {
  const [inputErrors, setInputErrors] = useState<Errors>({});

  function submit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = catchFormData(e.currentTarget);

    setInputErrors(catchInputErrors(formData));

    if (Object.keys(inputErrors).length > 0) {
      return false;
    }

    const protoData = formDataToProtoLink(formData);

    return false;
  }

  return { inputErrors: inputErrors, submit };
}

function catchFormData(form: EventTarget & HTMLFormElement) {
  const rawData = new FormData(form);
  const data = Object.fromEntries(rawData.entries());

  return data;
}

function catchInputErrors(data: ModalFormData) {
  const urlRegex =
    /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

  const { title, url, category, tags } = data;

  const newErrors: Errors = {};

  const cleanTitle = title?.trim() ?? "";

  if (!cleanTitle) {
    newErrors.title = "O título é obrigatório.";
  } else if (cleanTitle.length < 3) {
    newErrors.title = "O título deve ter pelo menos 3 caracteres visíveis.";
  } else if (cleanTitle.length > 50) {
    newErrors.title = "O título é muito longo (máximo de 50 caracteres).";
  }

  const cleanUrl = url?.trim() ?? "";

  if (!cleanUrl) {
    newErrors.url = "A URL de destino é obrigatória.";
  } else if (!urlRegex.test(cleanUrl)) {
    newErrors.url =
      "Informe uma URL válida contendo http:// ou https:// (ex: https://github.com).";
  }

  if (!category || /^--.*--$/.test(category.trim())) {
    newErrors.category = "Selecione uma categoria válida para o link.";
  } else if (!PREDEFINED_CATEGORIES.includes(category as LinkCategories)) {
    newErrors.category =
      "A categoria selecionada não pertence à lista permitida.";
  }

  const cleanTags = tags?.trim() ?? "";

  if (cleanTags) {
    const isPatternValid =
      /^[a-zA-Z0-9-]{2,20}(?:,\s*[a-zA-Z0-9-]{2,20}){0,4}$/.test(cleanTags);

    if (!isPatternValid) {
      newErrors.tags =
        "Separe até 5 tags por vírgula (ex: react, typescript). Cada tag deve ter de 2 a 20 caracteres sem espaços.";
    }
  }

  return newErrors;
}

function formDataToProtoLink(data: ModalFormData): ProtoLink | null {
  //WIP
  return null;
}
