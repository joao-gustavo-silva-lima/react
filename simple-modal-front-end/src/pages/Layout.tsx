import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <header>
        <div>
          <Link to="/">
            <span>Simple Modal</span>
          </Link>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
