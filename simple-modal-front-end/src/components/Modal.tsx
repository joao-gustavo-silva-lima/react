import { useForm, type SubmitHandler } from "react-hook-form";
import {
  loginUserSchema,
  type ModalUserInputs,
  registerUserSchema,
} from "../types/User.types";
import {
  useRegisterUser,
  useLoginUser,
  useFetchUser,
} from "../hooks/useUsers.hook";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import APIMessages from "../api/Users.api.messages";
import { useEffect } from "react";

export default function Modal({ mode }: { mode: "register" | "login" }) {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ModalUserInputs, unknown, ModalUserInputs>({
    mode: "onChange",
    resolver: zodResolver(
      mode === "register" ? registerUserSchema : loginUserSchema,
    ),
  });

  const navigate = useNavigate();

  const { isFetching, isSuccess } = useFetchUser(true);

  const { mutate: registerUser, isPending: pendingRegister } =
    useRegisterUser();
  const { mutate: loginUser, isPending: pedingLogin } = useLoginUser();

  const onSubmit: SubmitHandler<ModalUserInputs> = ({
    name,
    email,
    password,
  }) => {
    if (mode === "register") {
      registerUser(
        { name: name!, email, password, confirmPassword: password },
        {
          onError(error) {
            alert(
              APIMessages.get(error.code) ??
                "Um erro inesperado ocorreu. Tente novamente mais tarde.",
            );
          },
          onSuccess() {
            const message = APIMessages.get("USER_CREATED");

            if (message) {
              alert(message);
            }

            reset();
            navigate("/");
          },
        },
      );
    } else {
      loginUser(
        { email, password },
        {
          onError(error) {
            console.error(error);
            alert(
              APIMessages.get(error.code) ??
                "Um erro inesperado ocorreu. Tente novamente mais tarde.",
            );
          },
          onSuccess() {
            const message = APIMessages.get("LOGIN_SUCCESS");

            if (message) {
              alert(message);
            }

            reset();
            navigate("/profile");
          },
        },
      );
    }
  };

  useEffect(() => {
    if (isSuccess) {
      navigate("/profile");
    }
  }, [isSuccess]);

  if (isFetching) {
    return <p>Verificando autenticação...</p>;
  }

  return (
    <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <h2>{mode === "login" ? "LOGIN" : "REGISTRO"}</h2>
      <fieldset>
        {mode === "register" && (
          <label htmlFor="name">
            <span>Nome</span>
            <input type="text" {...register("name")} id="name" />
            {errors.name && <p>{errors.name.message}</p>}
          </label>
        )}
        <label htmlFor="email">
          <span>Email</span>
          <input type="text" {...register("email")} id="email" />
          {errors.email && <p>{errors.email.message}</p>}
        </label>
        <label htmlFor="password">
          <span>Senha</span>
          <input type="password" {...register("password")} id="password" />
          {errors.password && <p>{errors.password.message}</p>}
        </label>
        {mode === "register" && (
          <label htmlFor="confirm-password">
            <span>Confirmar senha</span>
            <input
              type="password"
              {...register("confirmPassword")}
              id="password"
            />
            {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
          </label>
        )}
        <Link to={mode === "login" ? "/register" : "/"}>
          {mode === "login"
            ? "É a primeira vez? Registre-se aqui."
            : "Já possui registro? Faça login aqui."}
        </Link>
        <button type="submit" disabled={pedingLogin || pendingRegister}>
          {mode === "login" ? "LOGIN" : "REGISTRAR"}
        </button>
      </fieldset>
    </form>
  );
}
