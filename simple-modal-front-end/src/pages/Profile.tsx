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
    <>
      <h2>Perfil</h2>
      <span>Boas-vindas novamente, {user.name.split(/\s+/)[0]}!</span>
      <br />
      <span>Dados do perfil:</span>
      <ul>
        <li>Nome: {user.name}</li>
        <li>Email: {user.email}</li>
        <li>Registrado em: {isoDateFormatter(user.createdAt)}</li>
      </ul>
      <button disabled={isLoginUserOut} onClick={handleLogout}>
        LOGOUT
      </button>
    </>
  );
}
