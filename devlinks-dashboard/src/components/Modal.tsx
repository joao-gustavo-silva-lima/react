import { useState, type InputHTMLAttributes } from "react";
import useModal from "../hooks/useModal.hook";
import { PREDEFINED_CATEGORIES } from "../types/links.types";

function Modal({
  title,
  refetchLinks,
}: {
  title: string;
  refetchLinks: () => void;
}) {
  const { errors, submit } = useModal();
  /* Modal title changes on visibility state toggling*/

  //Inputs receive formData trigger for validanting fields on useState

  return (
    <aside>
      <h3>{title}</h3>
      <form onSubmit={(e) => submit(e)}>
        <input type="text" name="title" id="title" />
        <input type="text" name="url" id="url" />
        <select name="category" id="category">
          <option value="">-- Categoria --</option>
          {PREDEFINED_CATEGORIES.map((category, i) => (
            <option key={i} value={category.toLowerCase()}>
              {category}
            </option>
          ))}
        </select>
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
