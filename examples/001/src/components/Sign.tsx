import { useEffect } from "react";
import { useTheme } from "../hooks/useTheme";

export default function Sign() {
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const toggler = setInterval(toggleTheme, 1000);

    return () => clearInterval(toggler);
  }, []);

  return (
    <>
      <h1>Theme: {theme}</h1>
      <Child />
    </>
  );
}

function Child() {
  return <InnerChild />;
}

function InnerChild() {
  const { theme } = useTheme();

  return <p>For sure, theme is {theme}</p>;
}
