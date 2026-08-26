import "./styles/tailwind.style.css";
import LinkList from "./components/LinkList";
import useLinksQuery from "./hooks/useLinksQuery.hook";
import Modal from "./components/Modal";
import { useState } from "react";
import type { Link, Query } from "./types/links.types";
import SearchBar from "./components/SearchBar";
import Metrics from "./components/Metrics";

function App() {
  const { links, isQuerying, errors, refetchLinks } = useLinksQuery();
  const [isModalEnabled, setIsModalEnabled] = useState(true);
  const [updatingLink, setUpdatingLink] = useState<Link>();
  const [filterQuery, setFilterQuery] = useState<Query>({});

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
      <Metrics isQuerying={isQuerying} links={links} />
      <br />
      <SearchBar filterQuery={filterQuery} setFilterQuery={setFilterQuery} />
      <br />
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
    </>
  );
}

export default App;
