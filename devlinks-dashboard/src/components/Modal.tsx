import useFormValidation from "../hooks/useFormValidation.hook";
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
  title,
  refetchLinks,
}: {
  title: string;
  refetchLinks: () => void;
}) {
  const { inputErrors, validateInput, validateSubmission } =
    useFormValidation();

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!validateSubmission(e.currentTarget)) {
      return false;
    }

    //Registering Action Here
  }

  return (
    <aside>
      <h3>{title}</h3>
      <form onSubmit={handleSubmit}>
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
      </form>
    </aside>
  );
}

export default Modal;
