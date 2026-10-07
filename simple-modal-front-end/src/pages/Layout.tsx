import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <header className="w-full bg-slate-dark">
        <div className="contained flex flex-row flex-nowrap justify-between px-[15px] py-[10px]">
          <Link className="button-basics" to="/">
            <span className="text text-xl font-bold">SimpleModal</span>
          </Link>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
