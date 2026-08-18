import {
  PREDEFINED_CATEGORIES,
  type LinkCategories,
  type ModalFormData,
} from "../types/links.types";

export default function useModal() {
  const urlRegex =
    /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

  let errors: Partial<Record<keyof ModalFormData, string>> = {};

  function catchFormData(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const rawData = new FormData(form);
    const data = Object.fromEntries(rawData.entries());

    validateFormData(data);
  }

  function validateFormData(data: ModalFormData) {
    const { title, url, category, tags } = data;

    errors = {};

    const cleanTitle = title?.trim() ?? "";

    if (!cleanTitle) {
      errors.title = "O título é obrigatório.";
    } else if (cleanTitle.length < 3) {
      errors.title = "O título deve ter pelo menos 3 caracteres visíveis.";
    } else if (cleanTitle.length > 50) {
      errors.title = "O título é muito longo (máximo de 50 caracteres).";
    }

    const cleanUrl = url?.trim() ?? "";

    if (!cleanUrl) {
      errors.url = "A URL de destino é obrigatória.";
    } else if (!urlRegex.test(cleanUrl)) {
      errors.url =
        "Informe uma URL válida contendo http:// ou https:// (ex: https://github.com).";
    }

    if (!category || /^--.*--$/.test(category.trim())) {
      errors.category = "Selecione uma categoria válida para o link.";
    } else if (!PREDEFINED_CATEGORIES.includes(category as LinkCategories)) {
      errors.category =
        "A categoria selecionada não pertence à lista permitida.";
    }

    const cleanTags = tags?.trim() ?? "";

    if (cleanTags) {
      const isPatternValid =
        /^[a-zA-Z0-9-]{2,20}(?:,\s*[a-zA-Z0-9-]{2,20}){0,4}$/.test(cleanTags);

      if (!isPatternValid) {
        errors.tags =
          "Separe até 5 tags por vírgula (ex: react, typescript). Cada tag deve ter de 2 a 20 caracteres sem espaços.";
      }
    }

    console.log(data, errors);

    if (Object.keys(errors).length === 0) console.log("Approved");
  }

  function formatFormData(_data: ModalFormData) {
    const data = { ..._data };

    data.title = data.title?.trim();
  }

  return { errors: { ...errors }, submit: catchFormData };
}
