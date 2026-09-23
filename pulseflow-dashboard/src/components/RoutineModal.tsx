import {
  type Routine,
  routineSchema,
  type HabitFormInput,
  type RoutineFormInput,
  type PatchingDTO,
} from "../types/routines.types";
import {
  useFieldArray,
  useForm,
  type Resolver,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import HabitFormField from "./HabitFormField";
import {
  useCreateResource,
  useFetchRoutineById,
  usePatchResource,
} from "../hooks/useRoutines";
import handleFormError from "../utils/handle-error.utils";
import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";

export default function RoutineModal({ mode }: { mode: "create" | "patch" }) {
  const { routineId } = useParams();

  const {
    data: routine,
    error: routineFetchingError,
    isFetching: isFetchingRoutine,
  } = useFetchRoutineById(routineId);

  const {
    reset,
    control,
    trigger,
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<RoutineFormInput, unknown, Routine>({
    resolver: zodResolver(
      mode === "create" ? routineSchema : routineSchema.pick({ title: true }),
    ) as unknown as Resolver<RoutineFormInput, unknown, Routine>,
    mode: "onChange",
    defaultValues:
      mode === "create"
        ? {
            habits: [{} as HabitFormInput],
          }
        : routine
          ? { title: routine.title }
          : undefined,
  });

  useEffect(() => {
    if (mode === "patch" && routine) {
      reset({ title: routine.title });
    }
  }, [mode, reset, routine]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "habits",
    disabled: mode !== "create",
  });

  const { mutate: createRoutine, isPending: isCreatingRoutine } =
    useCreateResource();
  const { mutate: patchRoutine, isPending: isPatchingRoutine } =
    usePatchResource();

  const navigate = useNavigate();

  const onSubmitPatch: SubmitHandler<Routine> = ({ title }) => {
    if (!routineId) {
      return;
    }

    const DTO: PatchingDTO = { title };

    patchRoutine(
      { DTO, routineId },
      {
        onError: (error) =>
          handleFormError(
            error,
            setError,
            "Um erro ocorreu durante a edição da rotina. Tente novamente depois.",
          ),
        onSuccess() {
          alert("A rotina foi editada com sucesso.");
          navigate(`/`);
        },
      },
    );
  };

  const onSubmit: SubmitHandler<Routine> = (data) => {
    createRoutine(
      { DTO: data },
      {
        onError: (error) =>
          handleFormError(
            error,
            setError,
            "Um erro ocorreu durante a criação da rotina. Tente novamente depois.",
          ),
        onSuccess(response) {
          const habitTitle = (response.data as Routine)?.title;

          alert(
            `A rotina ${habitTitle ? `"${habitTitle}"` : ""} foi criada com sucesso.`,
          );

          navigate(`/`);
        },
      },
    );
  };

  if (mode === "patch" && isFetchingRoutine) {
    return (
      <div className="fixed inset-0 z-10 flex items-center justify-center bg-background/80 p-screen-px">
        <p className="surface main-border w-full max-w-[560px] text-center text-text-secondary animate-pulse">
          Carregando rotina...
        </p>
      </div>
    );
  }

  if (mode === "patch" && routineFetchingError?.status === 404) {
    return (
      <div className="fixed inset-0 z-10 flex items-center justify-center bg-background/80 p-screen-px">
        <p className="surface main-border w-full max-w-[560px] text-center text-danger">
          404 - Rotina não encontrada.
        </p>
      </div>
    );
  }

  if (mode === "patch" && routineFetchingError) {
    return (
      <div className="fixed inset-0 z-10 flex items-center justify-center bg-background/80 p-screen-px">
        <p className="surface main-border w-full max-w-[560px] text-center text-danger">
          Não foi possível carregar a rotina.
        </p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto bg-background/80 p-screen-px">
      <form
        autoComplete="off"
        onSubmit={handleSubmit(mode === "create" ? onSubmit : onSubmitPatch)}
        className="surface main-border flex w-full max-w-[560px] flex-col gap-gap-lg"
      >
        <div className="flex flex-col gap-gap-xs border-b-[1px] border-border pb-gap-md">
          <p className="text-xs uppercase tracking-[0.12em] text-primary">
            Rotinas, hábitos e tarefas
          </p>
          <h2 className="text-lg font-semibold">
            {mode === "create" ? "Nova rotina" : "Editar rotina"}
          </h2>
        </div>
        <fieldset className="flex flex-col gap-gap-md">
          <div className="flex flex-col gap-gap-xs">
            <label className="text-sm font-medium" htmlFor="routine-title">
              Título da rotina
            </label>
            <input
              className="w-full rounded-sm main-border bg-background px-[0.75rem] py-[0.625rem] text-sm placeholder:text-text-muted focus:border-primary"
              type="text"
              id="routine-title"
              {...register("title")}
            />
            {errors.title?.message && (
              <p className="text-xs text-danger">{errors.title.message}</p>
            )}
          </div>
          {mode === "create" && (
            <>
              <p className="text-sm font-medium text-text-secondary">Hábitos</p>
              <div className="flex flex-col gap-gap-md">
                {fields.map((field, index) => (
                  <div
                    className="rounded-md main-border bg-background/50 p-gap-md"
                    key={field.id}
                  >
                    <HabitFormField
                      mode="create"
                      errors={errors}
                      trigger={trigger}
                      control={control}
                      register={register}
                      fieldPrefix={`habits.${index}`}
                      subTaskFieldArrayProps={{
                        control,
                        name: `habits.${index}.subTasks`,
                      }}
                    />
                    {index > 0 && (
                      <button
                        className="mt-gap-md text-xs text-danger hover:underline"
                        type="button"
                        onClick={() => remove(index)}
                      >
                        Remover hábito
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                className="w-fit rounded-md main-border border-primary px-[0.75rem] py-[0.5rem] text-sm font-medium text-primary hover:bg-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
                disabled={fields.length >= 15 || errors.habits !== undefined}
                type="button"
                onClick={async () => {
                  const habitsAreValid = await trigger("habits");

                  if (habitsAreValid) {
                    append({ title: "" } as HabitFormInput);
                  }
                }}
              >
                + Criar novo hábito
              </button>
            </>
          )}
        </fieldset>
        <input
          className="w-full rounded-md bg-primary px-[1rem] py-[0.625rem] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          disabled={
            mode === "create"
              ? isCreatingRoutine ||
                fields.length === 0 ||
                errors.habits !== undefined
              : isPatchingRoutine
          }
          type="submit"
          value={mode === "create" ? "Criar nova rotina" : "Salvar alterações"}
        />
      </form>
    </div>
  );
}
