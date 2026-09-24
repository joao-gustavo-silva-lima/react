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
import { Link, useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import Fallback from "../pages/Fallback";
import ActionButton from "./ActionButton";
import { Trash, X } from "lucide-react";

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
    return <Fallback message="A rotina que você tentou editar não foi encontrada." />;
  }

  if (mode === "patch" && routineFetchingError) {
    return <Fallback message="Não foi possível carregar a rotina para edição." />;
  }

  return (
    <form
      autoComplete="off"
      onSubmit={handleSubmit(mode === "create" ? onSubmit : onSubmitPatch)}
      className="surface rounded-[0] bp-sm:rounded-lg main-border flex w-full max-w-[450px] h-dvh bp-sm:h-fit max-h-dvh overflow-y-auto flex-col gap-gap-lg"
    >
      <div className="flex flex-row flex-nowrap justify-between">
        <h2 className="text-lg font-semibold">
          {mode === "create" ? "Nova rotina" : "Editar rotina"}
        </h2>
        <Link className="button-basics" to="/">
          <X />
        </Link>
      </div>
      <fieldset className="flex flex-col gap-gap-md">
        <div className="flex flex-col gap-gap-xs">
          <label className="text-base font-medium" htmlFor="routine-title">
            Título da rotina
          </label>
          <input
            className="w-full rounded-sm main-border bg-background px-[0.75rem] py-[0.625rem] text-sm placeholder:text-text-muted focus:border-primary"
            type="text"
            id="routine-title"
            {...register("title")}
          />
          {errors.title?.message && (
            <p className="text-sm text-danger">{errors.title.message}</p>
          )}
        </div>
      </fieldset>
      {mode === "create" && (
        <>
          <label className="text-base font-medium">Hábitos</label>
          {fields.map((field, index) => (
            <div
              className="flex flex-col rounded-md main-border bg-background/50 p-gap-md"
              key={field.id}
            >
              {fields.length > 1 && (
                <ActionButton
                  additionalClassName="self-end w-fit aspect-square !p-[5px]"
                  onClick={() => remove(index)}
                >
                  <Trash className="m-auto" size={20} />
                </ActionButton>
              )}
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
            </div>
          ))}
          <ActionButton
            type="button"
            additionalClassName="w-fit"
            onClick={async () => {
              const habitsAreValid = await trigger("habits");

              if (habitsAreValid) {
                append({ title: "" } as HabitFormInput);
              }
            }}
            disabled={fields.length >= 15 || errors.habits !== undefined}
          >
            + Criar novo hábito
          </ActionButton>
        </>
      )}
      <div className="flex flex-row flex-wrap justify-end items-center gap-gap-sm">
        <ActionButton additionalClassName="flex-1" to="/">
          Cancelar
        </ActionButton>
        <ActionButton
          additionalClassName="flex-1"
          type="submit"
          disabled={
            mode === "create"
              ? isCreatingRoutine ||
                fields.length === 0 ||
                errors.habits !== undefined
              : isPatchingRoutine
          }
        >
          {mode === "create" ? "Criar nova rotina" : "Salvar alterações"}
        </ActionButton>
      </div>
    </form>
  );
}
