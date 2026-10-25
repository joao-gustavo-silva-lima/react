import { cloneElement, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import {
  createUserSchema,
  loginUserSchema,
  type LoginUserInput,
  type UserInput,
  type UserModalInputs,
} from "../schemas/User.schema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function Modal({ mode }: { mode: "registro" | "login" }) {
  const isRegisterMode = mode === "registro";
  const [isViewPrivate, setIsViewPrivate] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserModalInputs, unknown, UserModalInputs>({
    mode: "onChange",
    resolver: zodResolver(isRegisterMode ? createUserSchema : loginUserSchema),
  });

  const onSubmit: SubmitHandler<UserModalInputs> = (data) => {
    console.log(data);
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
        <button type="submit">
          {isRegisterMode ? "Criar Conta" : "Entrar"}
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
