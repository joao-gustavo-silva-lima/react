import "./styles/tailwind.style.css";
import LinkList from "./components/LinkList";
import useLinksQuery from "./hooks/useLinksQuery.hook";
import Modal from "./components/Modal";
import { useState } from "react";
import type { Link } from "./types/links.types";

function App() {
  const { links, isQuerying, errors, refetchLinks } = useLinksQuery();
  const [isModalEnabled, setIsModalEnabled] = useState(false);
  const [updatingLink, setUpdatingLink] = useState<Link>();

  return (
    <>
      <Modal
        enabled={isModalEnabled}
        updatingLink={updatingLink}
        stopUpdating={() => setUpdatingLink(undefined)}
        refetchLinks={refetchLinks}
        setEnabled={setIsModalEnabled}
      />
      <br />
      <LinkList
        links={links}
        isQuerying={isQuerying}
        errors={errors}
        openUpdatingModal={(link: Link) => {
          setUpdatingLink(link);
          setIsModalEnabled(true);
        }}
      />
    </>
  );
}

export default App;
