import {
  useForm,
  type SubmitHandler,
  type UseFormRegisterReturn,
} from "react-hook-form";
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
    setError,
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

            if (error.status === 409) {
              setError("email", {
                message: APIMessages.get("USER_ALREADY_EXISTS"),
              });
            }
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
    <form
      className="flex flex-col gap-[15px] w-full max-w-[400px] m-auto px-[15px] py-[10px] h-fit overflow-y-auto"
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="text-lg font-bold">
        {mode === "login" ? "LOGIN" : "REGISTRO"}
      </h2>
      <fieldset className="flex flex-col flex-nowrap gap-[15px]">
        {mode === "register" && (
          <InputBundle
            id="name"
            type="text"
            title="Nome"
            error={errors.name?.message}
            registerReturn={register("name")}
          />
        )}
        <InputBundle
          id="email"
          title="Email"
          type="text"
          error={errors.email?.message}
          registerReturn={register("email")}
        />
        <InputBundle
          id="password"
          title="Senha"
          type="password"
          error={mode === "login" ? undefined : errors.password?.message}
          registerReturn={register("password")}
        />
        {mode === "register" && (
          <InputBundle
            id="confirm-password"
            title="Confirmar senha"
            type="password"
            error={errors.confirmPassword?.message}
            registerReturn={register("confirmPassword")}
          />
        )}
        <button
          className="w-full px-[7.5px] py-[2.5px] bg-white text-black rounded-sm button-basics"
          type="submit"
          disabled={pedingLogin || pendingRegister}
        >
          {mode === "login" ? "LOGIN" : "REGISTRAR"}
        </button>
        <Link
          className="m-auto text-sm underline text-[blue]"
          to={mode === "login" ? "/register" : "/"}
        >
          {mode === "login"
            ? "É a primeira vez? Registre-se aqui."
            : "Já possui registro? Faça login aqui."}
        </Link>
      </fieldset>
    </form>
  );
}

function InputBundle({
  id,
  type,
  error,
  title,
  registerReturn,
}: {
  id: string;
  title: string;
  error: string | undefined;
  type: React.HTMLInputTypeAttribute;
  registerReturn: UseFormRegisterReturn;
}) {
  return (
    <label className="flex flex-col flex-nowrap gap-[5px]" htmlFor={id}>
      <span className=" text-nowrap">{title}</span>
      <input
        className="w-full border-[1px] border-solid border-white rounded-sm p-[5px] text-sm"
        type={type}
        placeholder={`${title}...`}
        {...registerReturn}
        id={id}
      />
      {error && <p className="text-xs text-[red]">{error}</p>}
    </label>
  );
}
