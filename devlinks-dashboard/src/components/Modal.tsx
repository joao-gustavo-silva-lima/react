import { useCallback, useState } from "react";

function ValidationMessage() {}

function Modal({
  title,
  refetchLinks,
}: {
  title: string;
  refetchLinks: () => void;
}) {
  /* Modal title changes on visibility state toggling*/

  const [formDataObj, setFormDataObj] = useState({});

  const catchFormData = useCallback((e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const data = new FormData(form);
    const dataObj = Object.fromEntries(data.entries());

    setFormDataObj(dataObj);
  }, []);

  //Inputs receive formData trigger for validanting fields on useState

  return (
    <aside>
      <h3>{title}</h3>
      <form onSubmit={(e) => catchFormData(e)}>
        <label htmlFor="title">Título</label>
        <input type="text" name="title" id="title" />
        <label htmlFor="url">URL</label>
        <input type="text" name="url" id="url" />
        {/* CATEGORY: Choose option from select element, or "+ Add Category" */}
        <label htmlFor="tags">Tags</label>
        <input type="text" name="tags" id="tags" />
        <div>
          <button type="button">Cancelar</button>
          <button type="submit">Registrar</button>
        </div>
      </form>
    </aside>
  );
}

export default Modal;
