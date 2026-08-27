import React, { useState } from "react";
import useFormValidation from "../hooks/useFormValidation.hook";
import useLinkAction from "../hooks/useLinkActions.hook";
import { PREDEFINED_CATEGORIES, type Link } from "../types/links.types";

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
  const { isActing, registerLink, updateLinkByID } = useLinkAction();

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
    <div
      className={`${enabled ? "block" : "hidden"} absolute flex justify-center items-center top-0 w-full h-screen bg-overlay`}
    >
      <aside className="flex flex-col flex-nowrap gap-container w-full rounded-surface bg-surface main-border p-container">
        <h3 className="font-[700] text-h2">
          {updatingLink === undefined
            ? "Registrar Novo Link"
            : "Atualizar Link"}
        </h3>
        <form onSubmit={handleSubmit}>
          <fieldset className="flex flex-col gap-container" disabled={isActing}>
            <MonitoredInput label="Título" error={inputErrors.title}>
              <input
                onBlur={validateInput}
                onChange={validateInput}
                type="text"
                name="title"
                id="title"
                placeholder="Meu Link..."
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
                placeholder="https://..."
                defaultValue={updatingLink?.url ?? ""}
              />
            </MonitoredInput>
            <MonitoredInput error={inputErrors.category}>
              <select
                onBlur={validateInput}
                onChange={handleCategoryChange}
                name="category"
                id="category"
                value={category}
                className="capitalize"
              >
                <option value="">Categoria</option>
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
                placeholder="site, dev, links..."
                defaultValue={updatingLink?.tags.join(", ") ?? ""}
              />
            </MonitoredInput>
            <div className="flex flex-row flex-nowrap gap-[0.5rem] text-body font-[500]">
              <button
                className="p-btn rounded-input main-border hover:cursor-pointer"
                type="button"
                onClick={closeModal}
              >
                Cancelar
              </button>
              <button
                className="bg-brand p-btn rounded-input hover:cursor-pointer"
                type="submit"
              >
                {updatingLink === undefined ? "Registrar" : "Atualizar"}
              </button>
            </div>
          </fieldset>
        </form>
      </aside>
    </div>
  );
}

function MonitoredInput({
  label,
  error,
  children,
}: {
  label?: string;
  error?: string;
  children: React.ReactElement<React.InputHTMLAttributes<HTMLInputElement>>;
}) {
  const styledChild = React.cloneElement(children, {
    className:
      `text-body main-border ${error ? "border-error" : ""} ${children.type === "select" ? "open" : "focus"}:border-white rounded-input p-input` +
      " " +
      children.props.className,
  });

  return (
    <div className="flex flex-col flex-nowrap text-body gap-[2.5px]">
      {label && (
        <label className="w-fit" htmlFor={children.props.id}>
          {label}
        </label>
      )}
      {styledChild}
      {error && <span className="text-error">{error}</span>}
    </div>
  );
}

export default Modal;
