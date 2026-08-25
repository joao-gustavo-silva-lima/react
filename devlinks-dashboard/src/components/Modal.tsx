import { useState } from "react";
import useFormValidation from "../hooks/useFormValidation.hook";
import useLinkMutation from "../hooks/useLinkActions.hook";
import { PREDEFINED_CATEGORIES, type Link } from "../types/links.types";

function MonitoredInput({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactElement<React.InputHTMLAttributes<HTMLInputElement>>;
}) {
  return (
    <div>
      <label htmlFor={children.props.id}>{label}</label>
      {children}
      {error && <span>{error}</span>}
    </div>
  );
}

function Modal({
  enabled,
  updatingLink,
  setEnabled,
  stopUpdating,
  refetchLinks,
}: {
  enabled: boolean;
  updatingLink: Link | undefined;
  stopUpdating: () => void;
  refetchLinks: () => void;
  setEnabled: (enabled: boolean) => void;
}) {
  const { inputErrors, validateInput, validateSubmission } =
    useFormValidation();
  const { isMutating, registerLink, updateLinkByID } = useLinkMutation();

  const [category, setCategory] = useState(updatingLink?.category ?? "");

  function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    validateInput(e);
    setCategory(e.target.value);
  }

  function closeModal() {
    stopUpdating();
    setEnabled(false);
  }

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const validation = validateSubmission(e.currentTarget);

    if (!validation.success) {
      return;
    }

    (updatingLink === undefined
      ? registerLink(validation.validFormData!)
      : updateLinkByID(updatingLink.id, validation.validFormData!)
    ).then((result) => {
      alert(result.message);

      if (result.success) {
        e.target.reset();
        refetchLinks();
        closeModal();
      }
    });
  }

  return (
    <aside
      style={{
        display: enabled ? "block" : "none",
      }}
    >
      <h3>
        {updatingLink === undefined ? "Registrar Novo Link" : "Atualizar Link"}
      </h3>
      <form onSubmit={handleSubmit}>
        <fieldset disabled={isMutating}>
          <MonitoredInput label="Título" error={inputErrors.title}>
            <input
              onBlur={validateInput}
              onChange={validateInput}
              type="text"
              name="title"
              id="title"
              defaultValue={updatingLink?.title ?? ""}
            />
          </MonitoredInput>
          <MonitoredInput label="URL" error={inputErrors.url}>
            <input
              onBlur={validateInput}
              onChange={validateInput}
              type="text"
              name="url"
              id="url"
              defaultValue={updatingLink?.url ?? ""}
            />
          </MonitoredInput>
          <MonitoredInput label="Categoria" error={inputErrors.category}>
            <select
              onBlur={validateInput}
              onChange={handleCategoryChange}
              name="category"
              id="category"
              value={category}
            >
              <option value="-">-- Categoria --</option>
              {PREDEFINED_CATEGORIES.map((category, i) => (
                <option key={i} value={category.toLowerCase()}>
                  {category}
                </option>
              ))}
            </select>
          </MonitoredInput>
          <MonitoredInput label="Tags" error={inputErrors.tags}>
            <input
              onBlur={validateInput}
              onChange={validateInput}
              type="text"
              name="tags"
              id="tags"
              defaultValue={updatingLink?.tags.join(", ") ?? ""}
            />
          </MonitoredInput>
          <div>
            <button type="button" onClick={closeModal}>
              Cancelar
            </button>
            <button type="submit">
              {updatingLink === undefined ? "Registrar" : "Atualizar"}
            </button>
          </div>
        </fieldset>
      </form>
    </aside>
  );
}

export default Modal;
