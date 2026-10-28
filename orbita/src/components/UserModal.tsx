import { cloneElement, useState } from "react";
import {
  useForm,
  type Resolver,
  type SubmitHandler,
  type UseFormRegisterReturn,
} from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserSchema,
  deleteUserSchema,
  loginUserSchema,
  updateUserSchema,
  type DeleteUserInput,
  type LoginUserInput,
  type UpdateUserInput,
  type User,
  type UserInput,
  type UserModalInputs,
} from "../schemas/User.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCreateUser,
  useDeleteUser,
  useLoginUser,
  useUpdateUser,
} from "../hooks/useUser";
import type { MutateOptions } from "@tanstack/react-query";
import type HttpError from "../common/classes/HttpError";
import { API_MESSAGES } from "../api/messages.api";
import type { APIJSONResponse } from "../common/types/api.types";

type UserModalMode = "cadastro" | "login" | "edição" | "exclusão";

export default function UserModal({
  mode,
  user,
}: {
  mode: UserModalMode;
  user?: User;
}) {
  const navigate = useNavigate();

  const isRegisterMode = mode === "cadastro";
  const isLoginMode = mode === "login";
  const isEditMode = mode === "edição";
  const isDeleteMode = mode === "exclusão";

  const { mutate: createUser, isPending: isCreatingUser } = useCreateUser();
  const { mutate: loginUser, isPending: isLoggingUser } = useLoginUser();
  const { mutate: updateUser, isPending: isUpdatingUser } = useUpdateUser();
  const { mutate: deleteUser, isPending: isDeletingUser } = useDeleteUser();

  const isModalPending =
    isCreatingUser || isLoggingUser || isUpdatingUser || isDeletingUser;
  const schema = isRegisterMode
    ? createUserSchema
    : isLoginMode
      ? loginUserSchema
      : isEditMode
        ? updateUserSchema
        : deleteUserSchema;

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<UserModalInputs, unknown, UserModalInputs>({
    mode: "onChange",
    resolver: zodResolver(schema) as Resolver<UserModalInputs>,
    ...(isEditMode && user
      ? {
          defaultValues: {
            name: user.name,
            email: user.email,
            username: user.username,
          },
        }
      : {}),
  });

  const handleError = (error: HttpError, operation: string) => {
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
        const isRecognizedField = Object.keys(schema.shape).includes(field);

        setError(
          isRecognizedField ? (field as keyof UserModalInputs) : "root",
          {
            message:
              API_MESSAGES.get(errorCode) ??
              "O dado inserido está indisponível.",
          },
        );
      });
      return;
    }

    console.error(`Erro de ${operation} do usuário não reconhecido:`, error);
    alert(errorMessage ?? "Um erro ocorreu. Tente novamente mais tarde.");
  };

  const onSubmit: SubmitHandler<UserModalInputs> = (data) => {
    if (isRegisterMode) {
      const options: MutateOptions<User, HttpError, UserInput> = {
        onSuccess({ username }) {
          alert("A criação do usuário ocorreu com sucesso.");
          navigate(`/u/${username}`);
        },
        onError: (error) => handleError(error, "criação"),
      };
      createUser(data as UserInput, options);
      return;
    }

    if (isLoginMode) {
      const options: MutateOptions<User, HttpError, LoginUserInput> = {
        onSuccess({ username }) {
          alert("O login do usuário ocorreu com sucesso.");
          navigate(`/u/${username}`);
        },
        onError: (error) => handleError(error, "login"),
      };
      loginUser(data as LoginUserInput, options);
      return;
    }

    if (isEditMode) {
      const options: MutateOptions<User, HttpError, UpdateUserInput> = {
        onSuccess({ username }) {
          alert("A edição do usuário ocorreu com sucesso.");
          navigate(`/u/${username}`);
        },
        onError: (error) => handleError(error, "edição"),
      };
      updateUser(data as UpdateUserInput, options);
      return;
    }

    const options: MutateOptions<APIJSONResponse, HttpError, DeleteUserInput> =
      {
        onSuccess(response) {
          alert(
            API_MESSAGES.get(response.code) ??
              "Sua conta foi excluída com sucesso.",
          );
          navigate("/login");
        },
        onError: (error) => handleError(error, "exclusão"),
      };
    deleteUser(data as DeleteUserInput, options);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {!isDeleteMode && <h3>{"\u{1F300}"} Orbita</h3>}
      <h2>
        {isRegisterMode
          ? "Crie seu hub!"
          : isLoginMode
            ? "Bem-vindo de volta!"
            : isEditMode
              ? "Edite seu perfil"
              : "Excluir conta"}
      </h2>
      <span>
        {isRegisterMode
          ? "É rápido e gratuito."
          : isLoginMode
            ? "Entre na sua conta para continuar."
            : isEditMode
              ? "Atualize os dados da sua conta."
              : "Essa ação não pode ser desfeita."}
      </span>
      <fieldset>
        {(isRegisterMode || isEditMode) && (
          <Input label="Nome Completo" error={errors.name?.message}>
            <input type="text" id="name" {...register("name")} />
          </Input>
        )}
        {(isRegisterMode || isEditMode) && (
          <Input label="Email" error={errors.email?.message}>
            <input type="text" id="email" {...register("email")} />
          </Input>
        )}
        {(isRegisterMode || isLoginMode || isEditMode) && (
          <Input label="Usuário" error={errors.username?.message}>
            <input type="text" id="username" {...register("username")} />
          </Input>
        )}
        <Input label="Senha" error={errors.password?.message}>
          <PasswordInput register={() => register("password")} />
        </Input>
        {isEditMode && (
          <Input label="Senha Atual" error={errors.password?.message}>
            <PasswordInput register={() => register("currentPassword")} />
          </Input>
        )}
        {errors.root && <span>{errors.root.message}</span>}
        <button disabled={isModalPending} type="submit">
          {isModalPending ? "..." : isRegisterMode ? "Criar Conta" : "Entrar"}
        </button>
      </fieldset>
      {isRegisterMode && (
        <span>
          Já tem uma conta? <Link to="/login">Entrar</Link>
        </span>
      )}{" "}
      {isLoginMode && (
        <span>
          Não tem uma conta? <Link to="/cadastro">Criar conta</Link>
        </span>
      )}
    </form>
  );
}

function PasswordInput({
  register,
}: {
  register: () => UseFormRegisterReturn;
}) {
  const [isPasswordRevealed, setIsPasswordRevealed] = useState(false);

  return (
    <div>
      <input
        type={isPasswordRevealed ? "text" : "password"}
        id="password"
        {...register()}
      />
      <button
        type="button"
        onClick={() => setIsPasswordRevealed(!isPasswordRevealed)}
      >
        {"\u{1F441}"}
      </button>
    </div>
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
    <label htmlFor={children.props.id}>
      <span>{label}</span>
      {cloneElement(children, {
        className: children.props.className ?? "",
      })}
      {error && <p>{error}</p>}
    </label>
  );
}
