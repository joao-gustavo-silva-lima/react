import useFormValidation from "../hooks/useFormValidation.hook";
import useLinkMutation from "../hooks/useLinkMutation.hook";
import { PREDEFINED_CATEGORIES } from "../types/links.types";

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
  setEnabled,
  refetchLinks,
}: {
  enabled: boolean;
  refetchLinks: () => void;
  setEnabled: (enabled: boolean) => void;
}) {
  const { inputErrors, validateInput, validateSubmission } =
    useFormValidation();
  const { isMutating, register } = useLinkMutation();

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const validation = validateSubmission(e.currentTarget);

    if (!validation.success) {
      return;
    }

    register(validation.validFormData!).then((ok) => {
      if (ok) {
        refetchLinks();
        setEnabled(false);
      }
    });
  }

  return (
    <aside
      style={{
        display: enabled ? "block" : "none",
      }}
    >
      <h3>Registrar Novo Link</h3>
      <form onSubmit={handleSubmit}>
        <fieldset disabled={isMutating}>
          <MonitoredInput label="Título" error={inputErrors.title}>
            <input
              onBlur={validateInput}
              onChange={validateInput}
              type="text"
              name="title"
              id="title"
            />
          </MonitoredInput>
          <MonitoredInput label="URL" error={inputErrors.url}>
            <input
              onBlur={validateInput}
              onChange={validateInput}
              type="text"
              name="url"
              id="url"
            />
          </MonitoredInput>
          <MonitoredInput label="Categoria" error={inputErrors.category}>
            <select
              onBlur={validateInput}
              onChange={validateInput}
              name="category"
              id="category"
            >
              <option value="">-- Categoria --</option>
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
            />
          </MonitoredInput>
          {/* {generalMessage && <span>{generalMessage}</span>} */}
          <div>
            <button type="button">Cancelar</button>
            <button type="submit">Registrar</button>
          </div>
        </fieldset>
      </form>
    </aside>
  );
}

export default Modal;
