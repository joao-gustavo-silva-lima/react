import { XIcon } from "lucide-react";
import { cloneElement } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createLinkSchema,
  type Link,
  type LinkInput,
} from "../schemas/Link.schema";
import { useCreateLink, useUpdateLink } from "../hooks/useLink";
import type { MutateOptions } from "@tanstack/react-query";
import type HttpError from "../common/classes/HttpError";
import { API_MESSAGES } from "../api/messages.api";

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
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(createLinkSchema),
    ...(!isCreationModal && { defaultValues: { ...updatingLink } }),
  });

  const { mutate: createLink, isPending: isCreatingLink } = useCreateLink();
  const { mutate: updateLink, isPending: isUpdatingLink } = useUpdateLink();

  const isModalPending = isCreatingLink || isUpdatingLink;

  const onSubmit: SubmitHandler<LinkInput> = (data) => {
    const options: MutateOptions<
      Link,
      HttpError,
      LinkInput | { id: number; payload: LinkInput }
    > = {
      onSuccess() {
        alert(
          `A ${isCreationModal ? "criação" : "edição"} do link ocorreu com sucesso.`,
        );
        closeModal();
      },
      onError(error) {
        const errorMessage = API_MESSAGES.get(error.code);

        if (error.status >= 400) {
          if (error.details === undefined) {
            setError("root", {
              message:
                errorMessage ??
                "Algum dado inserido está indisponível. Tente novamente.",
            });
            return;
          }

          Object.entries(error.details).forEach(([field, errorCode]) => {
            const isRecognizedField = Object.keys(
              createLinkSchema.shape,
            ).includes(field);

            setError(isRecognizedField ? (field as keyof LinkInput) : "root", {
              message:
                API_MESSAGES.get(errorCode) ??
                "O dado inserido está indisponível.",
            });
          });
        } else {
          console.error(
            `Erro de ${isCreationModal ? "criação" : "edição"} do link não reconhecido:`,
            error,
          );

          alert(errorMessage ?? "Um erro ocorreu. Tente novamente mais tarde.");
        }
      },
    };

    if (isCreationModal) {
      createLink(data, options);
    } else {
      updateLink({ id: updatingLink.id, payload: data }, options);
    }
  };

  const onClose = () => {
    reset();
    closeModal();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <h2>{isCreationModal ? "Adicionar" : "Editar"} Link</h2>
        <button type="button" onClick={isModalPending ? undefined : onClose}>
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
        <Input label="Conteúdo" error={errors.ref?.message}>
          <input
            type="text"
            id="ref"
            defaultValue={updatingLink?.ref}
            {...register("ref")}
          />
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
        <button type="button" onClick={isModalPending ? undefined : onClose}>
          Cancelar
        </button>
        <button type="submit" disabled={isModalPending}>
          {isModalPending ? "..." : "Salvar"}
        </button>
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
