import { useNavigate } from "react-router-dom";
import { useFetchUser, useLogoutUser } from "../hooks/useUsers.hook";
import isoDateFormatter from "../utils/IsoDateFormatter.utils";
import { useEffect } from "react";
import APIMessages from "../api/Users.api.messages";
import { useQueryClient } from "@tanstack/react-query";
import Fallback from "./Fallback";
import { toast } from "react-toastify";

export default function Profile() {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const {
    data: user,
    isPending: isFetchingUser,
    isError,
    error,
  } = useFetchUser(true);

  const { mutate: logoutUser, isPending: isLoginUserOut } = useLogoutUser();

  const isUnauthorized =
    error?.code === "AUTH_TOKEN_REQUIRED" ||
    error?.code === "INVALID_AUTH_TOKEN";

  const handleLogout = () => {
    if (!confirm("Deseja realmente fazer logout?")) {
      return;
    }

    logoutUser(undefined, {
      onError(error) {
        const message =
          APIMessages.get(error.code) ||
          "Um erro ocorreu durante a tentativa de logout. Tente novamente mais tarde.";

        toast.error(message);
      },
      onSuccess(response) {
        const message = APIMessages.get(response.code);

        if (message) {
          toast.success(message);
        }

        queryClient.removeQueries({ queryKey: ["user"] });
        queryClient.invalidateQueries({ queryKey: ["user"] });
        navigate("/");
      },
    });
  };

  useEffect(() => {
    if (isUnauthorized) {
      navigate("/");
    }
  }, [isUnauthorized]);

  if (isFetchingUser) {
    return (
      <div className="contained flex flex-col gap-[16px] px-[15px] py-[24px] animate-pulse">
        <div className="h-[28px] w-[120px] rounded-md bg-bg-surface" />
        <div className="h-[18px] w-[240px] rounded-md bg-bg-surface" />
        <div className="h-[1px] w-full bg-border-subtle" />
        <div className="h-[14px] w-[140px] rounded-md bg-bg-surface" />
        <div className="flex flex-col gap-[12px]">
          <div className="flex items-center gap-[8px]">
            <div className="h-[14px] w-[60px] rounded-md bg-bg-surface" />
            <div className="h-[14px] w-[180px] rounded-md bg-bg-surface" />
          </div>
          <div className="flex items-center gap-[8px]">
            <div className="h-[14px] w-[60px] rounded-md bg-bg-surface" />
            <div className="h-[14px] w-[220px] rounded-md bg-bg-surface" />
          </div>
          <div className="flex items-center gap-[8px]">
            <div className="h-[14px] w-[120px] rounded-md bg-bg-surface" />
            <div className="h-[14px] w-[180px] rounded-md bg-bg-surface" />
          </div>
        </div>
        <div className="mt-[10px] h-[36px] w-[110px] rounded-md bg-bg-surface" />
      </div>
    );
  }

  if (isUnauthorized) {
    return <Fallback message="O que você está fazendo aqui?!" />;
  }

  if ((!isUnauthorized && isError) || user === undefined) {
    return (
      <Fallback
        message="Um erro ocorreu ao tentar buscar os dados do perfil. Tente novamente
        mais tarde."
      />
    );
  }

  return (
    <div className="contained flex flex-col gap-[10px] px-[25px] py-[15px]">
      <h2 className="text-xl font-bold text-text-primary">
        {"\u{1F464}"} PERFIL
      </h2>
      <p className="text-base font-semibold text-text-primary">
        Boas-vindas novamente, {user.name.split(/\s+/)[0]}! {"\u{2728}"}
      </p>
      <hr className="border-t border-border-subtle" />
      <p className="text-sm font-semibold text-text-primary">
        DADOS DO PERFIL {"\u{1F50D}"}
      </p>
      <ul className="flex flex-col gap-[12px] text-sm text-text-primary">
        <li className="flex flex-row flex-wrap items-center gap-[6px]">
          <span className="font-semibold text-text-secondary">Nome:</span>
          <span>{user.name}</span>
        </li>
        <li className="flex flex-row flex-wrap items-center gap-[6px]">
          <span className="font-semibold text-text-secondary">Email:</span>
          <span>{user.email}</span>
        </li>
        <li className="flex flex-row flex-wrap items-center gap-[6px]">
          <span className="font-semibold text-text-secondary">
            Registrado em:
          </span>
          <span>{isoDateFormatter(user.createdAt)}</span>
        </li>
      </ul>
      <button
        className="button-basics disabled:cursor-progress w-fit text-center rounded-md bg-brand-primary px-[12px] py-[10px] text-sm font-semibold text-text-on-brand not-disabled:hover:bg-brand-hover not-disabled:active:bg-brand-active disabled:animate-pulse"
        disabled={isLoginUserOut}
        onClick={handleLogout}
      >
        {isLoginUserOut ? "\u{23F3}" : "LOGOUT"}
      </button>
    </div>
  );
}
