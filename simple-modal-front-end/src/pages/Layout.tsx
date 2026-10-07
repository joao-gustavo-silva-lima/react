import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <header className="w-full border-b border-border-subtle bg-bg-surface">
        <div className="contained flex flex-row flex-nowrap items-center justify-between px-[25px] py-[15px]">
          <Link
            className="button-basics text-text-primary hover:text-brand-primary"
            to="/"
          >
            <span className="text-xl font-bold tracking-tight">
              SimpleModal {"\u{1F44B}"}
            </span>
          </Link>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
