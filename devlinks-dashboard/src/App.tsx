import "./styles/tailwind.style.css";
import LinkList from "./components/LinkList";
import useLinksQuery from "./hooks/useLinksQuery.hook";
import Modal from "./components/Modal";
import { useState } from "react";
import type { Link } from "./types/links.types";

function App() {
  const { links, isQuerying, errors, refetchLinks } = useLinksQuery();
  const [isModalEnabled, setIsModalEnabled] = useState(true);
  const [updatingLink, setUpdatingLink] = useState<Link>();

  return (
    <>
      <Modal
        key={updatingLink?.id ?? "modal"}
        enabled={isModalEnabled}
        updatingLink={updatingLink}
        refetchLinks={refetchLinks}
        setEnabled={setIsModalEnabled}
        stopUpdating={() => setUpdatingLink(undefined)}
      />
      <br />
      <LinkList
        links={links}
        errors={errors}
        refetchLinks={refetchLinks}
        isQuerying={isQuerying}
        openUpdatingModal={(link: Link) => {
          setUpdatingLink(link);
          setIsModalEnabled(true);
        }}
      />
    </>
  );
}

export default App;
