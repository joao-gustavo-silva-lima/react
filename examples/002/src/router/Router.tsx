import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  NavLink,
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router";

function HeaderLink({ to, title }: { to: string; title: string }) {
  return (
    <NavLink
      style={({ isActive }) =>
        isActive
          ? {
              backgroundColor: "red",
            }
          : {}
      }
      className={({ isActive }) => (isActive ? "active" : "")}
      to={to}
    >
      {title}
    </NavLink>
  );
}

export default function RouterNoSPA() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <>
              <h1>My Website Title</h1>
              <nav>
                <HeaderLink to="/" title="Home" />
                <HeaderLink to="/about" title="About" />
                <HeaderLink to="/dashboard" title="Dashboard" />
                <HeaderLink
                  to={`/number-inspector/${Math.ceil(Math.random() * 10)}`}
                  title="Inspection"
                />
                <HeaderLink
                  to={`/query?search=${"What am I supposed to be querying?...".replace(/\s+/g, "+")}`}
                  title="Query"
                />
                <HeaderLink to="/auto-redirect-page" title="Return" />
              </nav>
              <Outlet />
            </>
          }
        >
          <Route index element={<h1>Home Page</h1>} />
          <Route
            path="/about"
            element={
              <>
                <h1>About Page</h1>
                <Link to="/">Return Home</Link>
              </>
            }
          />
          <Route
            path="/dashboard"
            element={
              <>
                <h1>Dashboard Page</h1>
                <Link to="/">Return Home</Link>
              </>
            }
          />
          <Route
            path="/number-inspector/:entryNumber"
            element={<NumberInspectionPage />}
          />
          <Route path="/query" element={<QueryPage />} />
          <Route path="/auto-redirect-page" element={<AutoRedirectingPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function QueryPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("search");
  return (
    <>
      <h1>Query Page</h1>
      {query !== null ? (
        <p>Your query is "{query}"</p>
      ) : (
        <p>Well... you don't seem to be querying.</p>
      )}
      <Link to="/">Return Home</Link>
    </>
  );
}

function NumberInspectionPage() {
  const { entryNumber } = useParams();
  const formatedNumber = Number(entryNumber);
  const isValidNumber = !Number.isNaN(formatedNumber);

  return (
    <>
      <h1>Number Inspection Page</h1>
      {isValidNumber ? (
        <p>
          Your number is {formatedNumber} and it is{" "}
          {formatedNumber % 2 === 0 ? "even" : "odd"}!
        </p>
      ) : (
        <p>Expected a valid number and not "{entryNumber}"...</p>
      )}
      <Link to="/">Return Home</Link>
    </>
  );
}

function AutoRedirectingPage() {
  const navigate = useNavigate();
  const [time, setTime] = useState(3);

  useEffect(() => {
    const redirect = setTimeout(() => {
      navigate("/");
    }, 3000);

    const counter = setInterval(() => {
      setTime((t) => t - 1);
    }, 1000);

    return () => {
      clearTimeout(redirect);
      clearInterval(counter);
    };
  }, []);

  return (
    <>
      <h1>Return Page</h1>
      <p>You'll return home in {time} seconds...</p>
    </>
  );
}
