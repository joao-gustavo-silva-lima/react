import { ThemeProvider } from "./hooks/useTheme";
import Sign from "./components/Sign";

export default function App() {
  return (
    <ThemeProvider>
      <Sign />
    </ThemeProvider>
  );
}
