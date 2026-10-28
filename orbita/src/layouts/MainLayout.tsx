import { Link, Outlet } from "react-router-dom";
import { useFetchUserProfile } from "../hooks/useUser";

export default function MainLayout() {
  const { data: authenticatedUser, isSuccess } = useFetchUserProfile();

  return (
    <>
      <header>
        <Link to="/">{"\u{1F300}"} Orbita</Link>
        {isSuccess && authenticatedUser ? (
          <Link to={`/u/${authenticatedUser.username}`}>Perfil</Link>
        ) : (
          <div>
            <Link to="/login">Entrar</Link>
            <Link to="/cadastro">Cadastrar</Link>
          </div>
        )}
      </header>
      <Outlet />
    </>
  );
}
