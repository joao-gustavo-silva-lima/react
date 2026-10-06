import { useForm, type SubmitHandler } from "react-hook-form";
import {
  loginUserSchema,
  type ModalUserInputs,
  registerUserSchema,
} from "../types/User.types";
import { zodResolver } from "@hookform/resolvers/zod";

export default function Modal({ mode }: { mode: "register" | "login" }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ModalUserInputs, unknown, ModalUserInputs>({
    mode: "onChange",
    resolver: zodResolver(
      mode === "register" ? registerUserSchema : loginUserSchema,
    ),
  });

  const onSubmit: SubmitHandler<ModalUserInputs> = (data) => console.log(data);

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
        <button type="submit">
          {mode === "login" ? "LOGIN" : "REGISTRAR"}
        </button>
      </fieldset>
    </form>
  );
}
