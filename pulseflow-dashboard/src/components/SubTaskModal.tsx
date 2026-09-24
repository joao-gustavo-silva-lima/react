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
import Fallback from "../pages/Fallback";
import ActionButton from "./ActionButton";

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
    return (
      <div className="fixed inset-0 z-10 flex items-center justify-center bg-background/80 p-screen-px">
        <p className="surface main-border w-full max-w-[560px] text-center text-text-secondary animate-pulse">
          Carregando sub-tarefa...
        </p>
      </div>
    );
  }

  if (
    routineFetchingError?.status === 404 ||
    subTaskFetchingError?.status === 404
  ) {
    return <Fallback message={`Recurso não disponível ou não existe.`} />;
  }

  if (routineFetchingError || subTaskFetchingError) {
    return <Fallback message="Não foi possível carregar a sub-tarefa." />;
  }

  return (
    <form
      autoComplete="off"
      onSubmit={handleSubmit(mode === "create" ? onSubmit : onSubmitPatch)}
      className="surface rounded-[0] bp-sm:rounded-lg main-border flex w-full max-w-[450px] h-dvh bp-sm:h-fit max-h-dvh overflow-y-auto flex-col gap-gap-lg"
    >
      <p className="text-xs uppercase tracking-[0.12em] text-primary">
        Tarefa dentro do hábito
      </p>
      <h2 className="text-lg font-semibold">
        {mode === "create" ? "Nova sub-tarefa" : "Editar sub-tarefa"}
      </h2>
      <fieldset className="flex flex-col gap-gap-xs">
        <label className="text-sm font-medium" htmlFor="sub-task-title">
          Título da sub-tarefa
        </label>
        <input
          className="w-full rounded-sm main-border bg-background px-[0.75rem] py-[0.625rem] text-sm placeholder:text-text-muted focus:border-primary"
          id="sub-task-title"
          placeholder="Ex.: Alongar por 10 minutos"
          type="text"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-xs text-danger">{errors.title.message}</p>
        )}
      </fieldset>
      <div className="flex flex-row flex-wrap justify-end gap-gap-sm">
        <ActionButton additionalClassName="flex-1" to="/">
          Cancelar
        </ActionButton>
        <ActionButton
          additionalClassName="flex-1"
          type="submit"
          disabled={mode === "patch" && isPatchingSubTask}
        >
          {mode === "create" ? "Criar nova sub-tarefa" : "Salvar alterações"}
        </ActionButton>
      </div>
    </form>
  );
}
