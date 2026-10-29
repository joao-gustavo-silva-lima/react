import { Link, Outlet } from "react-router-dom";
import { useFetchUserProfile } from "../hooks/useUser";
import { OrbitIcon } from "lucide-react";

export default function MainLayout() {
  const { data: authenticatedUser, isSuccess } = useFetchUserProfile();

  return (
    <>
      <header>
        <div>
          <Link to="/">
            <OrbitIcon />
            <span>Orbita</span>
          </Link>
          <nav>
            {[
              ["Recursos", "/#recursos"],
              ["Funcionamento", "/#funcionamento"],
            ].map(([label, to], index) => (
              <Link key={`header__nav__link--${index}`} to={to}>
                {label}
              </Link>
            ))}
          </nav>
        </div>
        {isSuccess && authenticatedUser ? (
          <Link to={`/u/${authenticatedUser.username}`}>Perfil</Link>
        ) : (
          <div>
            <Link to="/login">Entrar</Link>
            <Link to="/cadastro">Cadastrar</Link>
          </div>
        )}
      </header>
      <div>
        <Outlet />
      </div>
    </>
  );
}
