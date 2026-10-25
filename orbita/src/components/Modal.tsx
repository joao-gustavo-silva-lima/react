import { cloneElement, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {
  loginUserSchema,
  createUserSchema,
  type UserModalInputs,
  type UserInput,
  type LoginUserInput,
  type User,
} from "../schemas/User.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateUser, useLoginUser } from "../hooks/useUser";
import type { MutateOptions } from "@tanstack/react-query";
import type HttpError from "../common/classes/HttpError";
import { API_MESSAGES } from "../api/messages.api";

export default function Modal({ mode }: { mode: "registro" | "login" }) {
  const isRegisterMode = mode === "registro";
  const [isViewPrivate, setIsViewPrivate] = useState(true);

  const navigate = useNavigate();

  const { mutate: createUser, isPending: isCreatingUser } = useCreateUser();
  const { mutate: loginUser, isPending: isLoggingUser } = useLoginUser();

  const isModalPending = isCreatingUser || isLoggingUser;

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<UserModalInputs, unknown, UserModalInputs>({
    mode: "onChange",
    resolver: zodResolver(isRegisterMode ? createUserSchema : loginUserSchema),
  });

  const onSubmit: SubmitHandler<UserModalInputs> = (data) => {
    const options: MutateOptions<User, HttpError, UserInput | LoginUserInput> =
      {
        onSuccess() {
          alert(
            `${isRegisterMode ? "A criação" : "O login"} do usuário ocorreu com sucesso.`,
          );
          navigate(`/perfil`);
        },
        onError(error) {
          const errorMessage = API_MESSAGES.get(error.code);

          if (errorMessage === undefined) {
            console.error(
              `Erro de ${isRegisterMode ? "criação" : "login"} do usuário não reconhecido:`,
              error,
            );
          } else if (error.status === 409) {
            setError("root", {
              message:
                errorMessage ??
                "Algum dado inserido está indisponível. Tente novamente.",
            });
          } else if (error.status === 400 && error.details !== undefined) {
            Object.entries(error.details).forEach(([field, errorCode]) => {
              const isRecognizedField = Object.keys(
                createUserSchema.shape,
              ).includes(field);

              setError(
                isRecognizedField ? (field as keyof UserInput) : "root",
                {
                  message:
                    API_MESSAGES.get(errorCode) ??
                    "O dado inserido está indisponível.",
                },
              );
            });
          } else {
            alert(
              errorMessage ?? "Um erro ocorreu. Tente novamente mais tarde.",
            );
          }
        },
      };

    if (isRegisterMode) {
      createUser(data as UserInput, options);
    } else {
      loginUser(data as LoginUserInput, options);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h3>{"\u{1F300}"} Orbita</h3>
      <h2>{isRegisterMode ? "Crie seu hub!" : "Bem-vindo de volta!"}</h2>
      <span>
        {isRegisterMode
          ? "É rápido e gratuito."
          : "Entre na sua conta para continuar."}
      </span>
      <fieldset>
        {isRegisterMode && (
          <>
            <Input label="Nome Completo" error={errors.name?.message}>
              <input type="text" id="name" {...register("name")} />
            </Input>
            <Input label="Email" error={errors.email?.message}>
              <input type="text" id="email" {...register("email")} />
            </Input>
          </>
        )}
        <Input label="Usuário" error={errors.username?.message}>
          <input type="text" id="username" {...register("username")} />
        </Input>
        <Input label="Senha" error={errors.password?.message}>
          <div>
            <input
              type={isViewPrivate ? "password" : "text"}
              id="password"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setIsViewPrivate(!isViewPrivate)}
            >
              {"\u{1F441}"}
            </button>
          </div>
        </Input>
        {errors.root && <span>{errors.root.message}</span>}
        <button disabled={isModalPending} type="submit">
          {isModalPending ? "..." : isRegisterMode ? "Criar Conta" : "Entrar"}
        </button>
      </fieldset>
      {isRegisterMode ? (
        <span>
          Já tem uma conta? <Link to="/login">Entrar</Link>
        </span>
      ) : (
        <span>
          Não tem uma conta? <Link to="/registro">Criar conta</Link>
        </span>
      )}
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
