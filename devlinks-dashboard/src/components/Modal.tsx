import useModal from "../hooks/useModal.hook";
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
  mode,
  links,
  refetchLinks,
}: {
  mode: string;
  links: Link[];
  refetchLinks: () => void;
}) {
  const { generalMessage, inputErrors, submit } = useModal(links);
  /* Modal title changes on visibility state toggling*/

  return (
    <aside>
      {/* isRegistering && loadingSurfaceSaver */}

      <h3>{mode}</h3>
      <form onSubmit={async (e) => (await submit(e)) && refetchLinks()}>
        <MonitoredInput label="Título" error={inputErrors.title}>
          <input type="text" name="title" id="title" />
        </MonitoredInput>
        <MonitoredInput label="URL" error={inputErrors.url}>
          <input type="text" name="url" id="url" />
        </MonitoredInput>
        <MonitoredInput label="Categoria" error={inputErrors.category}>
          <select name="category" id="category">
            <option value="">-- Categoria --</option>
            {PREDEFINED_CATEGORIES.map((category, i) => (
              <option key={i} value={category.toLowerCase()}>
                {category}
              </option>
            ))}
          </select>
        </MonitoredInput>
        <MonitoredInput label="Tags" error={inputErrors.tags}>
          <input type="text" name="tags" id="tags" />
        </MonitoredInput>
        {generalMessage && <span>{generalMessage}</span>}
        <div>
          <button type="button">Cancelar</button>
          <button type="submit">Registrar</button>
        </div>
      </form>
    </aside>
  );
}

export default Modal;
