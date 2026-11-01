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
            alert(
              errorMessage ??
                "Algum dado inserido está indisponível. Tente novamente.",
            );
            return;
          }

          Object.entries(error.details).forEach(([field, errorCode]) => {
            const isRecognizedField = Object.keys(
              createLinkSchema.shape,
            ).includes(field);

            if (!isRecognizedField) {
              alert("Um campo não identificado apresentou um erro.");
              return;
            }

            setError(field as keyof LinkInput, {
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
    <form
      className="flex min-h-dvh h-fit max-h-dvh w-full max-w-[400px] flex-col gap-control overflow-y-auto bg-elevated p-container bp-sm:min-h-[0px] bp-sm:rounded-modal"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-nowrap items-center justify-between">
        <h2 className="truncate text-2xl font-medium">
          {isCreationModal ? "Adicionar Link" : "Editar Link"}
        </h2>
        <button
          className="button-behaviour"
          type="button"
          onClick={isModalPending ? undefined : onClose}
        >
          <XIcon />
        </button>
      </div>
      <span className="text-muted">
        {isCreationModal
          ? "Adicione um novo link ao seu hub."
          : "Atualize os dados do seu link."}
      </span>
      <fieldset className="flex flex-col gap-element">
        <Input label="Título" error={errors.title?.message}>
          <input
            type="text"
            id="title"
            placeholder="Digite um título..."
            {...register("title")}
            defaultValue={updatingLink?.title}
          />
        </Input>
        <Input label="Conteúdo" error={errors.ref?.message}>
          <input
            type="text"
            id="ref"
            placeholder="https://..."
            defaultValue={updatingLink?.ref}
            {...register("ref")}
          />
        </Input>
        <Input label="Visibilidade" error={errors.visibility?.message}>
          <div className="flex flex-wrap gap-element">
            <label className="flex items-center gap-control">
              <input
                className="accent-primary"
                type="radio"
                id="visibility--public"
                value={"PUBLIC"}
                defaultChecked={
                  updatingLink === null || updatingLink.visibility === "PUBLIC"
                }
                {...register("visibility")}
              />
              Público
            </label>
            <label className="flex items-center gap-control">
              <input
                className="accent-primary"
                type="radio"
                id="visibility--private"
                value={"PRIVATE"}
                defaultChecked={updatingLink?.visibility === "PRIVATE"}
                {...register("visibility")}
              />
              Privado
            </label>
          </div>
        </Input>
      </fieldset>
      <div className="mt-container flex flex-col-reverse gap-control">
        <button
          className="button-behaviour w-full rounded-control border-1 border-border px-container hover:border-primary hover:bg-surface"
          type="button"
          onClick={isModalPending ? undefined : onClose}
        >
          Cancelar
        </button>
        <button
          className="button-behaviour--filled w-full !rounded-control"
          type="submit"
          disabled={isModalPending}
        >
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
  children: React.ReactElement<{ id?: string; className?: string }>;
}) {
  return (
    <div className="flex flex-col gap-[1.5px]">
      <span>{label}</span>
      {cloneElement(children, {
        className:
          children.props.className ??
          "bg-surface border-1 border-border p-control rounded-control",
      })}
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
