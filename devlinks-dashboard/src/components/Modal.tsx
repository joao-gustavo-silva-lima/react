import React, { useState, type SyntheticEvent } from "react";
import useFormValidation from "../hooks/useFormValidation.hook";
import useLinkAction from "../hooks/useLinkActions.hook";
import { type Link, type ModalFormData } from "../types/links.types";
import ActionButton from "./ActionButton";
import { X } from "lucide-react";
import CategorySelect from "./CategorySelect";

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
  const { inputErrors, validateInput, validateSubmission, clearValidation } =
    useFormValidation();
  const { isActing, registerLink, updateLinkByID } = useLinkAction();

  const [category, setCategory] = useState(updatingLink?.category ?? "");

  function closeModal() {
    stopUpdating();
    clearValidation();
    setEnabled(false);
  }

  function handleInputAction(e: SyntheticEvent<HTMLInputElement>) {
    validateInput(
      e.currentTarget.name as keyof ModalFormData,
      e.currentTarget.value,
      e.type === "change",
    );
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
      className={`${enabled ? "block" : "hidden"} fixed flex justify-center items-center top-0 w-full h-dvh bg-overlay z-2`}
    >
      <aside className="flex flex-col flex-nowrap gap-container w-full max-w-[400px] h-dvh bp1:h-fit max-h-dvh overflow-auto rounded-surface bg-surface main-border p-container">
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
                onBlur={handleInputAction}
                onChange={handleInputAction}
                type="text"
                name="title"
                id="title"
                maxLength={50}
                placeholder="Meu Link..."
                defaultValue={updatingLink?.title ?? ""}
              />
            </MonitoredInput>
            <MonitoredInput label="URL" error={inputErrors.url}>
              <input
                onBlur={handleInputAction}
                onChange={handleInputAction}
                type="text"
                name="url"
                id="url"
                max={300}
                placeholder="https://..."
                defaultValue={updatingLink?.url ?? ""}
              />
            </MonitoredInput>
            <MonitoredInput error={inputErrors.category}>
              <CategorySelect
                error={inputErrors.category !== undefined}
                category={category}
                validateInput={() => validateInput("category", category)}
                changeCategory={(category) => setCategory(category)}
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
                onBlur={handleInputAction}
                onChange={handleInputAction}
                type="text"
                name="tags"
                id="tags"
                placeholder="site, dev, links..."
                defaultValue={updatingLink?.tags.join(", ") ?? ""}
              />
            </MonitoredInput>
            <div className="flex flex-row flex-nowrap gap-[0.5rem] text-body font-[500]">
              <ActionButton action={closeModal}>Cancelar</ActionButton>
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
