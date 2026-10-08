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
import { toast } from "react-toastify";

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

  const { mutate: registerUser, isPending: isRegisterPending } =
    useRegisterUser();
  const { mutate: loginUser, isPending: isLoginPending } = useLoginUser();

  const isModalPending = isRegisterPending || isLoginPending;

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
            toast.error(
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
              toast.success(message);
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
            toast.error(
              APIMessages.get(error.code) ??
                "Um erro inesperado ocorreu. Tente novamente mais tarde.",
            );
          },
          onSuccess() {
            const message = APIMessages.get("LOGIN_SUCCESS");

            if (message) {
              toast.success(message);
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

  useEffect(() => {
    reset();
  }, [mode]);

  if (isFetching) {
    return (
      <div className="m-auto flex h-fit w-full max-w-[420px] animate-pulse flex-col gap-[15px] px-[25px] py-[15px]">
        <div className="h-[28px] w-[120px] rounded-md bg-bg-surface" />
        <div className="flex flex-col gap-[15px]">
          <div className="flex flex-col gap-[6px]">
            <div className="h-[14px] w-[46px] rounded-md bg-bg-surface" />
            <div className="h-[40px] w-full rounded-md bg-bg-surface" />
          </div>
          <div className="flex flex-col gap-[6px]">
            <div className="h-[14px] w-[46px] rounded-md bg-bg-surface" />
            <div className="h-[40px] w-full rounded-md bg-bg-surface" />
          </div>
          <div className="flex flex-col gap-[6px]">
            <div className="h-[14px] w-[46px] rounded-md bg-bg-surface" />
            <div className="h-[40px] w-full rounded-md bg-bg-surface" />
          </div>
          <div className="h-[42px] w-full rounded-md bg-bg-surface" />
          <div className="mx-auto h-[14px] w-[210px] rounded-md bg-bg-surface" />
        </div>
      </div>
    );
  }

  return (
    <form
      className="m-auto flex h-fit w-full max-w-[420px] flex-col gap-[15px] overflow-y-auto px-[25px] py-[15px]"
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="text-xl font-bold text-text-primary">
        {mode === "login" ? "LOGIN \u{1F511}" : "REGISTRO \u{1F4CB}"}
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
          className="button-basics disabled:cursor-progress w-full disabled:w-fit text-center rounded-md m-auto bg-brand-primary px-[12px] py-[10px] text-sm font-semibold text-text-on-brand not-disabled:hover:bg-brand-hover not-disabled:active:bg-brand-active disabled:animate-pulse"
          type="submit"
          disabled={isModalPending}
        >
          <span>
            {isModalPending
              ? "\u{23F3}"
              : mode === "login"
                ? "LOGIN"
                : "REGISTRAR"}
          </span>
        </button>
        <Link
          className="m-auto text-sm font-medium text-brand-primary underline transition-colors hover:text-brand-hover"
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
    <label className="flex flex-col flex-nowrap gap-[6px]" htmlFor={id}>
      <span className="text-sm font-medium text-text-secondary">{title}</span>
      <input
        className="w-full rounded-md border border-border-default bg-bg-input px-[10px] py-[8px] text-sm text-text-primary placeholder:text-text-placeholder focus:border-border-focus focus:shadow-input-focus"
        type={type}
        placeholder={`${title}...`}
        {...registerReturn}
        id={id}
      />
      {error && <p className="text-xs text-error">{error}</p>}
    </label>
  );
}
