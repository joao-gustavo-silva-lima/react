import { createContext, useContext, useState } from "react";

interface ThemeContext {
  theme: "white" | "dark";
  toggleTheme: () => void;
}

export function useTheme() {
  return useContext(ThemeContext)!;
}

const ThemeContext = createContext<ThemeContext | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"white" | "dark">("white");

  function toggleTheme() {
    setTheme((prev) => (prev === "white" ? "dark" : "white"));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
