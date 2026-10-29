import { Link, Outlet } from "react-router-dom";
import { useFetchUserProfile } from "../hooks/useUser";
import { OrbitIcon } from "lucide-react";

export default function MainLayout() {
  const { data: authenticatedUser, isSuccess } = useFetchUserProfile();

  return (
    <>
      <header className="fixed top-0 left-0 bg-bg shadow-card w-full">
        <div className="contained flex flex-nowrap justify-between items-center gap-container">
          <div className="flex flex-nowrap items-center gap-container">
            <Link
              className="flex flex-nowrap gap-[7.5px] items-center button-behaviour hover:text-primary active:text-primary-hover !p-0"
              to="/"
            >
              <OrbitIcon size={30} />
              <span className="text-2xl font-bold">Orbita</span>
            </Link>
            <nav className="flex flex-nowrap gap-element items-center">
              {[
                ["Início", "/"],
                ["Recursos", "/#recursos"],
                ["Funcionamento", "/#funcionamento"],
              ].map(([label, to], index) => (
                <Link
                  className="button-behaviour hover:text-primary active:text-primary-hover"
                  key={`header__nav__link--${index}`}
                  to={to}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          {isSuccess && authenticatedUser ? (
            <Link
              className="button-behaviour--filled"
              to={`/u/${authenticatedUser.username}`}
            >
              Perfil
            </Link>
          ) : (
            <div className="flex flex-nowrap items-center gap-element">
              <Link to="/login">Entrar</Link>
              <Link className="button-behaviour--filled" to="/cadastro">
                Cadastrar
              </Link>
            </div>
          )}
        </div>
      </header>
      <Outlet />
    </>
  );
}
