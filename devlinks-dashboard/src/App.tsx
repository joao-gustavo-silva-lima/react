import "./styles/tailwind.style.css";
import LinkList from "./components/LinkList";
import useLinksQuery from "./hooks/useLinksQuery.hook";
import Modal from "./components/Modal";

function App() {
  const { links, isQuerying, errors, refetchLinks } = useLinksQuery();

  return (
    <>
      <LinkList links={links} isQuerying={isQuerying} errors={errors} />
      <br />
      <Modal title="Registrar Novo Link" refetchLinks={refetchLinks} />
    </>
  );
}

export default App;
