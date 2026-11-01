import { Link, Outlet } from "react-router-dom";
import { useFetchUserProfile } from "../hooks/useUser";
import { MenuIcon, OrbitIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function MainLayout() {
  const { data: authenticatedUser, isSuccess } = useFetchUserProfile();
  const [isSmallScreen, setIsSmallScreen] = useState(
    () => screen.availWidth <= 600,
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const isSmall = screen.availWidth <= 600;

      setIsSmallScreen(isSmall);
      if (!isSmall) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <>
      <header className="fixed top-0 left-0 bg-bg shadow-card w-full z-5">
        <div className="contained flex flex-nowrap items-center justify-between gap-container">
          <div className="flex flex-nowrap items-center gap-container">
            <Link
              className="flex flex-nowrap items-center gap-[7.5px] button-behaviour hover:text-primary active:text-primary-hover !p-0"
              to="/"
            >
              <OrbitIcon size={30} />
              <span className="text-2xl font-bold">Orbita</span>
            </Link>
            {!isSmallScreen && <HeaderNavigation />}
          </div>
          {!isSmallScreen && (
            <HeaderAccount
              authenticatedUser={authenticatedUser}
              isSuccess={isSuccess}
            />
          )}
          {isSmallScreen && (
            <button
              className="button-behaviour"
              type="button"
              aria-expanded={isSidebarOpen}
              aria-controls="main-sidebar"
              aria-label={isSidebarOpen ? "Fechar menu" : "Abrir menu"}
              onClick={() => setIsSidebarOpen((isOpen) => !isOpen)}
            >
              {isSidebarOpen ? <XIcon /> : <MenuIcon />}
            </button>
          )}
        </div>
      </header>
      {isSmallScreen && isSidebarOpen && (
        <div
          className="fixed inset-0 z-4 bg-black/50"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}
      {isSmallScreen && (
        <aside
          id="main-sidebar"
          className={`fixed right-0 top-0 z-5 flex min-h-dvh w-[min(80%,320px)] flex-col gap-container bg-surface p-container  shadow-card transition-transform ${
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
          aria-hidden={!isSidebarOpen}
        >
          <div className="flex flex-nowrap justify-between items-center">
            <Link
              className="flex flex-nowrap items-center gap-[7.5px] button-behaviour hover:text-primary active:text-primary-hover !p-0"
              to="/"
              onClick={() => setIsSidebarOpen(false)}
            >
              <OrbitIcon size={30} />
              <span className="text-2xl font-bold">Orbita</span>
            </Link>
            <button
              className="button-behaviour"
              onClick={() => setIsSidebarOpen(false)}
            >
              <XIcon size={30} />
            </button>
          </div>
          <HeaderNavigation onNavigate={closeSidebar} vertical />
          <hr className="border-1 border-border" />
          <HeaderAccount
            authenticatedUser={authenticatedUser}
            isSuccess={isSuccess}
            onNavigate={closeSidebar}
            vertical
          />
        </aside>
      )}
      <Outlet />
      <footer className=" bg-surface">
        <div className="contained flex flex-wrap justify-between items-center text-muted text-sm gap-container">
          <div className="flex flex-nowrap items-start gap-element">
            <OrbitIcon className="text-primary" size={30} />
            <div className="flex flex-col">
              <span className="brand-gradient-text text-base font-bold">
                Orbita
              </span>
              <span>Seu perfil, suas conexões, sem limites.</span>
            </div>
          </div>
          <nav className="flex flex-wrap gap-element items-center underline">
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
          <span className="font-medium">
            &copy; {new Date().getFullYear()} Orbita. Todos os direitos
            reservados.
          </span>
        </div>
      </footer>
    </>
  );
}

const headerNavigation = [
  ["Início", "/"],
  ["Recursos", "/#recursos"],
  ["Funcionamento", "/#funcionamento"],
] as const;

function HeaderNavigation({
  onNavigate,
  vertical = false,
}: {
  onNavigate?: () => void;
  vertical?: boolean;
}) {
  return (
    <nav
      className={`flex ${
        vertical ? "flex-col items-stretch" : "flex-row items-center"
      } gap-element`}
    >
      {headerNavigation.map(([label, to], index) => (
        <Link
          className={`button-behaviour ${
            vertical ? "text-left" : ""
          } hover:text-primary active:text-primary-hover`}
          key={`header__nav__link--${index}`}
          to={to}
          onClick={onNavigate}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}

function HeaderAccount({
  authenticatedUser,
  isSuccess,
  onNavigate,
  vertical = false,
}: {
  authenticatedUser: { username: string } | null | undefined;
  isSuccess: boolean;
  onNavigate?: () => void;
  vertical?: boolean;
}) {
  return isSuccess && authenticatedUser ? (
    <Link
      className="button-behaviour--filled"
      to={`/u/${authenticatedUser.username}`}
      onClick={onNavigate}
    >
      Perfil
    </Link>
  ) : (
    <div
      className={`flex ${
        vertical ? "flex-col items-stretch" : "flex-row items-center"
      } gap-element`}
    >
      <Link className="button-behaviour" to="/login" onClick={onNavigate}>
        Entrar
      </Link>
      <Link
        className="button-behaviour--filled"
        to="/cadastro"
        onClick={onNavigate}
      >
        Cadastrar
      </Link>
    </div>
  );
}
