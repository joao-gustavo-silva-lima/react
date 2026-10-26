import { XIcon } from "lucide-react";
import { cloneElement } from "react";

export default function LinkModal({ closeModal }: { closeModal: () => void }) {
  return (
    <form>
      <div>
        <h2>Adicionar Link</h2>
        <button type="button" onClick={closeModal}>
          <XIcon />
        </button>
      </div>
      <fieldset>
        <Input label="Título" error={undefined}>
          <input type="text" id="title" />
        </Input>
        <Input label="Conteúdo" error={undefined}>
          <input type="text" id="ref" />
        </Input>
        <Input label="Visibilidade" error={undefined}>
          <>
            <div>
              <input
                type="radio"
                id="visibility--public"
                value={"PUBLIC"}
                checked
              />
              <label htmlFor="visibility--public">Público</label>
            </div>
            <div>
              <input type="radio" id="visibility--private" value={"PRIVATE"} />
              <label htmlFor="visibility--private">Privado</label>
            </div>
          </>
        </Input>
      </fieldset>
      <div>
        <button
          type="button"
          onClick={() => {
            closeModal();
          }}
        >
          Cancelar
        </button>
        <button type="submit">Salvar</button>
      </div>
    </form>
  );
}

function Input({
  label,
  error,
  children,
}: {
  label: string;
  error: string | undefined;
  children: React.ReactElement<React.InputHTMLAttributes<HTMLInputElement>>;
}) {
  return (
    <label htmlFor={children.props.id}>
      <span>{label}</span>
      {cloneElement(children, {
        className: children.props.className ?? "",
      })}
      {error && <p>{error}</p>}
    </label>
  );
}
