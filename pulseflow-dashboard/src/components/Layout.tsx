import { Menu } from "lucide-react";
import { Link, Outlet } from "react-router";

export default function Layout() {
  return (
    <>
      <header className="contained flex flex-row items-center justify-between mb-screen-py">
        <Link className="button-basics" to="/">
          <img
            className="w-[45px]"
            src="/images/logo.png"
            alt="Logo do PulseFlow."
          />
        </Link>
        <button className="button-basics">
          <Menu />
        </button>
      </header>
      <Outlet />
    </>
  );
}
