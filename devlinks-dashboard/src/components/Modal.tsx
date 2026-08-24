import useFormValidation from "../hooks/useFormValidation.hook";
import useLinkMutation from "../hooks/useLinkMutation.hook";
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
  const { isMutating, register, update } = useLinkMutation();

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
      ? register(validation.validFormData!)
      : update(updatingLink.id, validation.validFormData!)
    ).then((ok) => {
      if (ok) {
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
              onChange={validateInput}
              name="category"
              id="category"
              defaultValue={updatingLink?.category ?? "-"}
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
