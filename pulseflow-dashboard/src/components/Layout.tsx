import {
  ChartSpline,
  Dot,
  LayoutDashboard,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router";
import useBodyScrollLock from "../hooks/useBodyScrollLock";

export default function Layout() {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const sideBarLinks: [LucideIcon, string, string][] = [
    [LayoutDashboard, "/", "Dashboard"],
    [ChartSpline, "/analytics", "Relatórios"],
  ];

  const {} = useBodyScrollLock(isSideBarOpen);

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
        <button
          onClick={() => setIsSideBarOpen(true)}
          className="button-basics"
        >
          <Menu size={22.5} />
        </button>
      </header>
      <div className="flex flex-row flex-nowrap items-center">
        <Outlet />
        <aside
          style={{
            transform: `translateX(${isSideBarOpen ? 0 : 100}%)`,
          }}
          className={`transition-all duration-[.5s] fixed right-0 top-0 flex flex-col w-full max-w-[320px] bg-surface h-dvh main-border bp-min:rounded-l-lg p-card-p`}
        >
          <div className="flex flex-row flex-nowrap items-center justify-between mb-[20px]">
            <Link
              className="flex flex-row flex-nowrap items-center gap-gap-xs button-basics button-basics"
              to="/"
            >
              <img
                className="w-[45px]"
                src="/images/logo.png"
                alt="Logo do PulseFlow."
              />
              <h1 className="text-xl font-bold text-primary">PulseFlow</h1>
            </Link>
            <button
              onClick={() => setIsSideBarOpen(false)}
              className="button-basics"
            >
              <X size={22.5} />
            </button>
          </div>
          <ul className="flex flex-col gap-gap-md">
            {sideBarLinks.map(([Icon, to, title], index) => (
              <NavLink
                className={({ isActive }) =>
                  `relative flex flex-row flex-nowrap items-center gap-gap-sm p-[10px] main-border rounded-sm button-basics ${isActive && "text-primary bg-primary-foreground border-primary-foreground"} hover:border-primary`
                }
                key={`side-bar-link-${index}`}
                onClick={() => setIsSideBarOpen(false)}
                to={to}
              >
                {({ isActive }) => (
                  <>
                    <Icon />
                    <span className="text-base font-semibold">{title}</span>
                    {isActive && (
                      <Dot
                        color=""
                        className="absolute translate-y-[-50%] top-[50%] right-[10px]"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </ul>
        </aside>
      </div>
    </>
  );
}
