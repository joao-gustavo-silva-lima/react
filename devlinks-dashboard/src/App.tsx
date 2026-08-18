import "./styles/tailwind.style.css";
import LinkList from "./components/LinkList";
import useLinks from "./hooks/useLinks.hook";
import Modal from "./components/Modal";

function App() {
  const { links, isLoading, err, refetchLinks } = useLinks();

  return (
    <>
      <LinkList links={links} isLoading={isLoading} err={err} />
      <br />
      <Modal title="Registrar Novo Link" refetchLinks={refetchLinks} />
    </>
  );
}

export default App;
