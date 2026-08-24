import "./styles/tailwind.style.css";
import LinkList from "./components/LinkList";
import useLinksQuery from "./hooks/useLinksQuery.hook";
import Modal from "./components/Modal";
import { useState } from "react";

function App() {
  const { links, isQuerying, errors, refetchLinks } = useLinksQuery();
  const [isModalEnabled, setIsModalEnabled] = useState(true);

  return (
    <>
      <LinkList links={links} isQuerying={isQuerying} errors={errors} />
      <br />
      <Modal
        enabled={isModalEnabled}
        refetchLinks={refetchLinks}
        setEnabled={setIsModalEnabled}
      />
    </>
  );
}

export default App;
