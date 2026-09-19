import { useEffect } from "react";
import { useForm, type Resolver, type SubmitHandler } from "react-hook-form";
import {
  subTaskSchema,
  type SubTask,
  type SubTaskFormInput,
} from "../types/routines.types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCreateResource,
  useFetchRoutineById,
  useFetchSubTaskById,
  usePatchResource,
} from "../hooks/useRoutines";
import handleFormError from "../utils/handle-error.utils";
import { useNavigate, useParams } from "react-router";

export default function SubTaskModal({ mode }: { mode: "create" | "patch" }) {
  const { routineId, habitId, subTaskId } = useParams();
  const navigate = useNavigate();
  const { error: routineFetchingError, isFetching: isFetchingRoutine } =
    useFetchRoutineById(routineId);
  const {
    data: subTask,
    error: subTaskFetchingError,
    isFetching: isFetchingSubTask,
  } = useFetchSubTaskById(routineId, habitId, subTaskId);

  const {
    reset,
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<SubTaskFormInput, unknown, SubTask>({
    resolver: zodResolver(
      mode === "create" ? subTaskSchema : subTaskSchema.pick({ title: true }),
    ) as unknown as Resolver<SubTaskFormInput, unknown, SubTask>,
    mode: "onChange",
    defaultValues:
      mode === "patch" && subTask ? { title: subTask.title } : undefined,
  });

  useEffect(() => {
    if (mode === "patch" && subTask) {
      reset({ title: subTask.title });
    }
  }, [mode, reset, subTask]);

  const { mutate: createResource } = useCreateResource();
  const { mutate: patchResource, isPending: isPatchingSubTask } =
    usePatchResource();

  const onSubmitPatch: SubmitHandler<SubTask> = ({ title }) => {
    if (!routineId || !habitId || !subTaskId) {
      return;
    }

    patchResource(
      { DTO: { title }, routineId, habitId, subTaskId },
      {
        onError: (error) =>
          handleFormError(
            error,
            setError,
            "Um erro ocorreu durante a edição da sub-tarefa. Tente novamente depois.",
          ),
        onSuccess() {
          alert("A sub-tarefa foi editada com sucesso.");
          navigate(`/`);
        },
      },
    );
  };

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

  if (isFetchingRoutine || (mode === "patch" && isFetchingSubTask)) {
    return <p>Carregando sub-tarefa...</p>;
  }

  if (
    routineFetchingError?.status === 404 ||
    subTaskFetchingError?.status === 404
  ) {
    return (
      <p>
        404 - {subTaskFetchingError ? "Sub-tarefa" : "Rotina"} não encontrada.
      </p>
    );
  }

  if (routineFetchingError || subTaskFetchingError) {
    return <p>Não foi possível carregar a sub-tarefa.</p>;
  }

  return (
    <form
      autoComplete="off"
      onSubmit={handleSubmit(mode === "create" ? onSubmit : onSubmitPatch)}
    >
      <h2>{mode === "create" ? "NOVA SUB-TAREFA" : "EDITAR SUB-TAREFA"}</h2>
      <fieldset>
        <label htmlFor="">Título da Sub-Tarefa</label>
        <input type="text" {...register("title")} />
        {errors.title && <p>{errors.title.message}</p>}
        <button disabled={mode === "patch" && isPatchingSubTask} type="submit">
          {mode === "create" ? "Criar Nova Sub-Tarefa" : "Editar Sub-Tarefa"}
        </button>
      </fieldset>
    </form>
  );
}
