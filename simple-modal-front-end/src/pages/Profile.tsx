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
    <div className="flex flex-col gap-[10px] contained px-[15px] py-[10px]">
      <h2 className="text-lg font-bold">PERFIL</h2>
      <span className="text-md font-semibold">
        Boas-vindas novamente, {user.name.split(/\s+/)[0]}!
      </span>
      <span className="font-semibold">Dados do perfil:</span>
      <ul className="flex flex-col gap-[7.5px]">
        <li className="flex flex-row flex-nowrap gap-[5px]">
          <span className="font-semibold">Nome: </span>
          <span className="text-normal">{user.name}</span>
        </li>
        <li className="flex flex-row flex-nowrap gap-[5px]">
          <span className="font-semibold">Email: </span>
          <span className="text-normal">{user.email}</span>
        </li>
        <li className="flex flex-row flex-nowrap gap-[5px]">
          <span className="font-semibold">Registrado em: </span>
          <span className="text-normal">
            {isoDateFormatter(user.createdAt)}
          </span>
        </li>
      </ul>
      <button
        className="w-fit px-[7.5px] py-[2.5px] mt-[20px] bg-white text-black rounded-sm button-basics"
        disabled={isLoginUserOut}
        onClick={handleLogout}
      >
        LOGOUT
      </button>
    </div>
  );
}
