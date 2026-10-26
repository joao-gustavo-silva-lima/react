import { XIcon } from "lucide-react";
import { cloneElement } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createLinkSchema,
  type Link,
  type LinkInput,
} from "../schemas/Link.schema";

export default function LinkModal({
  updatingLink,
  closeModal,
}: {
  updatingLink: Link | null;
  closeModal: () => void;
}) {
  const isCreationModal = updatingLink === null;

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(createLinkSchema),
    ...(!isCreationModal && { defaultValues: { ...updatingLink } }),
  });

  const onSubmit: SubmitHandler<LinkInput> = (data) => {
    console.log(data);
  };

  const onClose = () => {
    reset();
    closeModal();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <h2>{isCreationModal ? "Adicionar" : "Editar"} Link</h2>
        <button type="button" onClick={onClose}>
          <XIcon />
        </button>
      </div>
      <fieldset>
        <Input label="Título" error={errors.title?.message}>
          <input
            type="text"
            id="title"
            {...register("title")}
            defaultValue={updatingLink?.title}
          />
        </Input>
        <Input
          label="Conteúdo"
          error={errors.ref?.message}
          {...register("ref")}
        >
          <input type="text" id="ref" defaultValue={updatingLink?.ref} />
        </Input>
        <Input label="Visibilidade" error={errors.visibility?.message}>
          <div>
            <div>
              <input
                type="radio"
                id="visibility--public"
                value={"PUBLIC"}
                defaultChecked={
                  updatingLink === null || updatingLink.visibility === "PUBLIC"
                }
                {...register("visibility")}
              />
              <label htmlFor="visibility--public">Público</label>
            </div>
            <div>
              <input
                type="radio"
                id="visibility--private"
                value={"PRIVATE"}
                {...register("visibility")}
                defaultChecked={updatingLink?.visibility === "PRIVATE"}
              />
              <label htmlFor="visibility--private">Privado</label>
            </div>
          </div>
        </Input>
      </fieldset>
      <div>
        <button type="button" onClick={onClose}>
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
