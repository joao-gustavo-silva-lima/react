import { useNavigate } from "react-router-dom";
import { useFetchUser } from "../hooks/useUsers.hook";
import isoDateFormatter from "../utils/IsoDateFormatter.utils";
import { useEffect } from "react";

export default function Profile() {
  const navigate = useNavigate();

  const { data: user, isPending, isError, error } = useFetchUser();

  const isUnauthorized =
    error?.code === "AUTH_TOKEN_REQUIRED" ||
    error?.code === "INVALID_AUTH_TOKEN";

  useEffect(() => {
    if (isUnauthorized) {
      navigate("/");
    }
  }, [isUnauthorized]);

  if (isUnauthorized) {
    return <p>O que você faz aqui?!</p>;
  }

  if (isPending) {
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
    </>
  );
}
