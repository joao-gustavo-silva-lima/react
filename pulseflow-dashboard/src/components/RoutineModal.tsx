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
import { useCreateResource, usePatchResource } from "../hooks/useRoutines";
import handleFormError from "../utils/handle-error.utils";
import { useNavigate, useParams } from "react-router";

export default function RoutineModal({ mode }: { mode: "create" | "patch" }) {
  const {
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
        : undefined,
  });

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
  const { routineId } = useParams();

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

  return (
    <form
      autoComplete="off"
      onSubmit={handleSubmit(mode === "create" ? onSubmit : onSubmitPatch)}
    >
      <h2>{mode === "create" ? "NOVA ROTINA" : "EDITAR ROTINA"}</h2>
      <fieldset>
        <div>
          <label htmlFor="routine-title">Título da Rotina</label>
          <input type="text" id="routine-title" {...register("title")} />
          {errors.title?.message && <p>{errors.title.message}</p>}
        </div>
        {mode === "create" && (
          <>
            <p>Hábitos</p>
            {fields.map((field, index) => (
              <div key={field.id}>
                <HabitFormField
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
                  <button type="button" onClick={() => remove(index)}>
                    Remover hábito
                  </button>
                )}
              </div>
            ))}
            <button
              disabled={fields.length >= 15 || errors.habits !== undefined}
              type="button"
              onClick={async () => {
                const habitsAreValid = await trigger("habits");

                if (habitsAreValid) {
                  append({ title: "" } as HabitFormInput);
                }
              }}
            >
              Criar Novo Hábito
            </button>
          </>
        )}
      </fieldset>
      <input
        disabled={
          mode === "create"
            ? isCreatingRoutine ||
              fields.length === 0 ||
              errors.habits !== undefined
            : isPatchingRoutine
        }
        type="submit"
        value={mode === "create" ? "Criar Nova Rotina" : "Editar Rotina"}
      />
    </form>
  );
}
