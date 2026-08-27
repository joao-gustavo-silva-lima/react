import "./assets/styles/tailwind.style.css";
import LinkList from "./components/LinkList";
import useLinksQuery from "./hooks/useLinksQuery.hook";
import Modal from "./components/Modal";
import { useState } from "react";
import type { Link, Query } from "./types/links.types";
import SearchBar from "./components/SearchBar";
import Metrics from "./components/Metrics";
import Header from "./components/Header";
import ActionButton from "./components/ActionButton";

function App() {
  const { links, isQuerying, errors, refetchLinks } = useLinksQuery();
  const [isModalEnabled, setIsModalEnabled] = useState(false);
  const [updatingLink, setUpdatingLink] = useState<Link>();
  const [filterQuery, setFilterQuery] = useState<Query>({});

  return (
    <>
      <Header />
      <Modal
        key={updatingLink?.id ?? "modal"}
        enabled={isModalEnabled}
        updatingLink={updatingLink}
        refetchLinks={refetchLinks}
        setEnabled={setIsModalEnabled}
        stopUpdating={() => setUpdatingLink(undefined)}
      />
      <div className="container justify-self-center flex flex-col gap-container">
        <h1 className="font-[700] text-h1">DevLinks Dashboard</h1>
        <Metrics isQuerying={isQuerying} links={links} />
        <SearchBar filterQuery={filterQuery} setFilterQuery={setFilterQuery} />
        <LinkList
          links={links}
          errors={errors}
          isQuerying={isQuerying}
          filterQuery={filterQuery}
          refetchLinks={refetchLinks}
          setFilterQuery={setFilterQuery}
          openUpdatingModal={(link: Link) => {
            setUpdatingLink(link);
            setIsModalEnabled(true);
          }}
        />
      </div>
      <div className="fixed bottom-[30px] left-[50%] translate-[-50%] z-1">
        <ActionButton action={() => setIsModalEnabled(true)} filled={true}>
          Registrar Novo Link
        </ActionButton>
      </div>
    </>
  );
}

export default App;
