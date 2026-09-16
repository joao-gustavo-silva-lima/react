import {
  useForm,
  useFieldArray,
  type FieldPath,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CATEGORIES_TO_PT_BR,
  habitSchema,
  type Habit,
} from "../types/routines.types";
import { useNavigate, useParams } from "react-router";
import { useCreateHabit, useFetchRoutineById } from "../hooks/useRoutines";
import { API_MESSAGES } from "../api/messages.api";

export default function HabitModal() {
  const {
    control,
    register,
    setError,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(habitSchema),
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    name: "subTasks",
    control,
  });

  const navigate = useNavigate();
  const { routineId } = useParams();
  const { error: routineFetchingError } = useFetchRoutineById(routineId);
  const { mutate: createHabit, isPending: isCreatingHabit } = useCreateHabit();

  const onSubmit: SubmitHandler<Habit> = async (habit) => {
    createHabit(
      { routineId: routineId!, habit },
      {
        onError(error) {
          if (error.appendix?.zodErrors) {
            Object.entries(error.appendix.zodErrors).forEach(
              ([field, message]) => {
                setError(field as FieldPath<Habit>, {
                  type: "server",
                  message: API_MESSAGES.get(message),
                });
              },
            );
          } else {
            alert(
              API_MESSAGES.get(error.code) ??
                "Um erro ocorreu durante a criação do hábito. Tente novamente depois.",
            );
          }
        },
        onSuccess(response) {
          const habitTitle = response.data?.title;

          alert(
            `O hábito ${habitTitle ? `"${habitTitle}"` : ""} foi criado com sucesso.`,
          );

          navigate(`/`);
        },
      },
    );
  };

  if (routineFetchingError) {
    //Return 404 or broken page
    return (
      <p>
        Oops...{" "}
        {API_MESSAGES.get(routineFetchingError.code) ??
          "Um erro inesperado ocorreu. Tente novamente mais tarde."}
      </p>
    );
  }

  return (
    <>
      <h2>NOVO HÁBITO</h2>
      <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <fieldset>
          <div>
            <label htmlFor="title">Título do Hábito</label>
            <input
              type="text"
              id="title"
              placeholder="Correr 15 Km..."
              {...register("title")}
            />
            {errors.title && <p>{errors.title.message}</p>}
          </div>
          <div>
            <label>Categoria</label>
            <select id="category" {...register("category")}>
              <option value="">Selecione uma categoria</option>
              {[...CATEGORIES_TO_PT_BR].map(([category, label]) => (
                <option key={category} value={category}>
                  {label}
                </option>
              ))}
            </select>
            {errors.category && <p>{errors.category.message}</p>}
          </div>
          <div>
            <label>
              Subtarefas{" "}
              {fields.length > 0 && <span>{`(${fields.length} / 10)`}</span>}
            </label>
            {fields.map((field, index) => (
              <div key={field.id}>
                <div>
                  <input {...register(`subTasks.${index}.title`)} />
                  <input
                    onClick={() => remove(index)}
                    type="button"
                    value="excluir"
                  />
                </div>
                {errors.subTasks && errors.subTasks[index] && (
                  <p>{errors.subTasks[index]?.title?.message}</p>
                )}
              </div>
            ))}
            <div>
              <input
                disabled={fields.length >= 10 || errors.subTasks !== undefined}
                onClick={async () => {
                  const subTasksAreValid = await trigger("subTasks");

                  if (subTasksAreValid) {
                    append({ title: "" });
                  }
                }}
                type="button"
                value="Adicionar Sub-tarefa"
              />
              {errors.subTasks?.root && <p>{errors.subTasks!.root.message}</p>}
            </div>
          </div>
          <input disabled={isCreatingHabit} type="submit" value="Criar" />
        </fieldset>
      </form>
    </>
  );
}
