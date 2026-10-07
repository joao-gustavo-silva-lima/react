import { useNavigate } from "react-router-dom";
import { useFetchUser, useLogoutUser } from "../hooks/useUsers.hook";
import isoDateFormatter from "../utils/IsoDateFormatter.utils";
import { useEffect } from "react";
import APIMessages from "../api/Users.api.messages";
import { useQueryClient } from "@tanstack/react-query";

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

        alert(message);
      },
      onSuccess(response) {
        const message = APIMessages.get(response.code);

        if (message) {
          alert(message);
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

  if (isUnauthorized) {
    return <p>O que você faz aqui?!</p>;
  }

  if (isFetchingUser) {
    return <p>Carregando dados do perfil...</p>;
  }

  if ((!isUnauthorized && isError) || user === undefined) {
    return (
      <p>
        Um erro ocorreu ao tentar buscar os dados do perfil. Tente novamente
        mais tarde.
      </p>
    );
  }

  return (
    <div className="contained flex flex-col gap-[10px] px-[25px] py-[15px]">
      <h2 className="text-xl font-bold text-text-primary">PERFIL</h2>
      <p className="text-base font-semibold text-text-primary">
        Boas-vindas novamente, {user.name.split(/\s+/)[0]}!
      </p>
      <hr className="border-t border-border-subtle" />
      <p className="text-sm font-semibold text-text-primary">
        Dados do perfil:
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
        className="button-basics mt-[20px] w-fit rounded-md bg-brand-primary px-[16px] py-[8px] text-sm font-semibold text-text-on-brand hover:bg-brand-hover active:bg-brand-active"
        disabled={isLoginUserOut}
        onClick={handleLogout}
      >
        LOGOUT
      </button>
    </div>
  );
}
