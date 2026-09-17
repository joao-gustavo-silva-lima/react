import { useForm, type SubmitHandler } from "react-hook-form";
import {
  subTaskSchema,
  type SubTask,
  type SubTaskFormInput,
} from "../types/routines.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateResource } from "../hooks/useRoutines";
import handleFormError from "../utils/handle-error.utils";
import { useNavigate, useParams } from "react-router";

export default function SubTaskModal() {
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<SubTaskFormInput, unknown, SubTask>({
    resolver: zodResolver(subTaskSchema),
    mode: "onChange",
  });

  const { routineId, habitId } = useParams();
  const navigate = useNavigate();

  const { mutate: createResource } = useCreateResource();

  const onSubmit: SubmitHandler<SubTask> = (data) => {
    createResource(
      { DTO: data, routineId, habitId },
      {
        onError: (error) =>
          handleFormError(
            error,
            setError,
            "Um erro ocorreu durante a criação da sub-tarefa. Tente novamente depois.",
          ),
        onSuccess(response) {
          const habitTitle = (response.data as SubTask)?.title;

          alert(
            `A sub-tarefa ${habitTitle ? `"${habitTitle}"` : ""} foi criado com sucesso.`,
          );

          navigate(`/`);
        },
      },
    );
  };

  return (
    <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <h2>NOVA SUB-TAREFA</h2>
      <fieldset>
        <label htmlFor="">Título da Sub-Tarefa</label>
        <input type="text" {...register("title")} />
        {errors.title && <p>{errors.title.message}</p>}
        <button type="submit">Criar Nova Sub-Tarefa</button>
      </fieldset>
    </form>
  );
}
