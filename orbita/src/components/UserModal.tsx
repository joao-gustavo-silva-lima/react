import { cloneElement, useEffect, useState } from "react";
import {
  useForm,
  type Resolver,
  type SubmitHandler,
  type UseFormRegisterReturn,
} from "react-hook-form";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
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
import { EyeIcon, EyeOffIcon, OrbitIcon, XIcon } from "lucide-react";

type UserModalMode = "cadastro" | "login" | "edição" | "exclusão";

export default function UserModal({ mode }: { mode: UserModalMode }) {
  const navigate = useNavigate();

  const isRegisterMode = mode === "cadastro";
  const isLoginMode = mode === "login";
  const isEditMode = mode === "edição";
  const isDeleteMode = mode === "exclusão";

  const { user } =
    isEditMode || isDeleteMode
      ? useOutletContext<{ user: User }>()
      : { user: null };

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
    reset,
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
        alert(
          errorMessage ??
            "Algum dado inserido está indisponível. Tente novamente.",
        );
        return;
      }

      Object.entries(error.details).forEach(([field, errorCode]) => {
        const isRecognizedField = Object.keys(schema.shape).includes(field);

        if (!isRecognizedField) {
          alert("Um campo não identificado apresentou um erro.");
          return;
        }

        setError(field as keyof UserModalInputs, {
          message:
            API_MESSAGES.get(errorCode) ?? "O dado inserido está indisponível.",
        });
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

  useEffect(() => {
    if ((isEditMode || isDeleteMode) && user === null) {
      navigate("/login");
    }

    reset();
  }, [user, mode]);

  return (
    <form
      className="flex flex-col gap-control justify-center max-w-[400px] m-auto"
      onSubmit={handleSubmit(onSubmit)}
    >
      {!(isDeleteMode || isEditMode) && (
        <h3 className="flex flex-nowrap items-center gap-[5px] m-auto text-xl font-bold mb-container">
          {<OrbitIcon className="text-primary" />} Orbita
        </h3>
      )}
      {(isDeleteMode || isEditMode) && (
        <Link to={`/u/${user?.username}`}>
          <XIcon />
        </Link>
      )}
      <h2 className="text-2xl font-medium">
        {isRegisterMode
          ? "Crie seu hub!"
          : isLoginMode
            ? "Bem-vindo de volta!"
            : isEditMode
              ? "Edite seu perfil"
              : "Excluir conta"}
      </h2>
      <span className="text-muted">
        {isRegisterMode
          ? "É rápido e gratuito."
          : isLoginMode
            ? "Entre na sua conta para continuar."
            : isEditMode
              ? "Atualize os dados da sua conta."
              : "Essa ação não pode ser desfeita."}
      </span>
      <fieldset className="flex flex-col gap-element">
        {(isRegisterMode || isEditMode) && (
          <Input label="Nome Completo" error={errors.name?.message}>
            <input
              type="text"
              placeholder="Digite seu nome..."
              id="name"
              {...register("name")}
            />
          </Input>
        )}
        {(isRegisterMode || isEditMode) && (
          <Input label="Email" error={errors.email?.message}>
            <input
              type="text"
              placeholder="seu@email.com"
              id="email"
              {...register("email")}
            />
          </Input>
        )}
        {(isRegisterMode || isLoginMode || isEditMode) && (
          <Input label="Usuário" error={errors.username?.message}>
            <input
              type="text"
              placeholder="Digite seu usuário..."
              id="username"
              {...register("username")}
            />
          </Input>
        )}
        <Input label="Senha" error={errors.password?.message}>
          <PasswordInput register={() => register("password")} />
        </Input>
        {isEditMode && (
          <Input label="Senha Atual" error={errors.currentPassword?.message}>
            <PasswordInput register={() => register("currentPassword")} />
          </Input>
        )}
        <button
          className="button-behaviour--filled !w-full !rounded-control mt-container"
          disabled={isModalPending}
          type="submit"
        >
          {isModalPending
            ? "..."
            : isRegisterMode
              ? "Criar Conta"
              : isLoginMode
                ? "Entrar"
                : isEditMode
                  ? "Salvar"
                  : "Excluir"}
        </button>
      </fieldset>
      {(isRegisterMode || isLoginMode) && (
        <span className="m-auto mt-container text-muted">
          {isRegisterMode ? `Já tem uma conta?` : `Não tem uma conta?`}{" "}
          <Link
            className="text-primary hover:underline font-medium"
            to={isRegisterMode ? "/login" : "/cadastro"}
          >
            {isRegisterMode ? "Entrar" : "Criar conta"}
          </Link>
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
    <div className="relative">
      <input
        type={isPasswordRevealed ? "text" : "password"}
        id="password"
        className="w-full bg-surface border-1 border-border p-control rounded-control"
        placeholder="Digite sua senha..."
        {...register()}
      />
      <button
        className="absolute translate-y-[-50%] right-0 top-[50%] button-behaviour"
        type="button"
        onClick={() => setIsPasswordRevealed(!isPasswordRevealed)}
      >
        {isPasswordRevealed ? <EyeOffIcon /> : <EyeIcon />}
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
    <label className="flex flex-col gap-[1.5px]" htmlFor={children.props.id}>
      <span>{label}</span>
      {cloneElement(children, {
        className:
          children.props.className ??
          "bg-surface border-1 border-border p-control rounded-control",
      })}
      {error && <p className="text-sm text-danger">{error}</p>}
    </label>
  );
}
