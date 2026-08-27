import React, { useState } from "react";
import useFormValidation from "../hooks/useFormValidation.hook";
import useLinkAction from "../hooks/useLinkActions.hook";
import { PREDEFINED_CATEGORIES, type Link } from "../types/links.types";
import ActionButton from "./ActionButton";
import { ChevronDown, X } from "lucide-react";

export default function Modal({
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
        <div className="flex flex-nowrap w-full items-center justify-between">
          <h3 className="font-[700] text-h2">
            {updatingLink === undefined
              ? "Registrar Novo Link"
              : "Atualizar Link"}
          </h3>
          <div className="animated-button p-[5px]" onClick={closeModal}>
            <X width={22.5} />
          </div>
        </div>
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
              <CategorySelect
                category={category}
                setCategory={(category) => setCategory(category)}
              />
            </MonitoredInput>
            <input
              type="hidden"
              id="category"
              name="category"
              value={category}
            />
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
              <ActionButton type="submit" action={closeModal}>
                Cancelar
              </ActionButton>
              <ActionButton type="submit" filled={true}>
                {updatingLink === undefined ? "Registrar" : "Atualizar"}
              </ActionButton>
            </div>
          </fieldset>
        </form>
      </aside>
    </div>
  );
}

function CategorySelect({
  category: categoryState,
  setCategory,
}: {
  category: string;
  setCategory: (category: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const optionClassName = `rounded-input p-input hover:cursor-pointer hover:bg-border-main`;

  return (
    <div className="relative">
      <button
        type="button"
        onBlur={() => setIsOpen(false)}
        onFocus={() => setIsOpen(true)}
        className="flex flex-row flex-nowrap justify-between items-center w-full capitalize main-border focus:border-white rounded-input p-input hover:cursor-pointer"
      >
        <span>{categoryState || "Categoria"}</span>
        <ChevronDown width={17.5} />
      </button>

      <ul
        className={`absolute top-0 left-0 ${isOpen ? "flex" : "hidden"} flex-col flex-nowrap w-full h-[150px] bg-surface capitalize rounded-input main-border overflow-auto`}
      >
        <li className={optionClassName} onMouseDown={() => setCategory("")}>
          <option value="">Categoria</option>
        </li>
        {PREDEFINED_CATEGORIES.map((category, i) => (
          <li
            className={optionClassName}
            onMouseDown={() => setCategory(category.toLowerCase())}
            key={i}
          >
            {category}
          </li>
        ))}
      </ul>
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
  children: React.ReactNode &
    React.ReactElement<React.InputHTMLAttributes<HTMLInputElement>>;
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
