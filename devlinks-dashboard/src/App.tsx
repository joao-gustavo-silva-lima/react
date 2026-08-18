import "./styles/tailwind.style.css";
import LinkList from "./components/LinkList";
import { useLinks } from "./hooks/useLinks.hook";

function App() {
  const { links, isLoading, err, refetchLinks } = useLinks();

  return <LinkList links={links} isLoading={isLoading} err={err} />;
}

export default App;
