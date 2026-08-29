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
import { LinkIcon } from "lucide-react";

function App() {
  const { links, isQuerying, hasQueryFailed, refetchLinks } = useLinksQuery();
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
      <div className="contained m-auto flex flex-col gap-container mb-[60px]">
        <h1 className="font-[700] text-h1">DevLinks Dashboard</h1>
        <Metrics isQuerying={isQuerying} links={links} />
        <SearchBar filterQuery={filterQuery} setFilterQuery={setFilterQuery} />
        <LinkList
          links={links}
          hasQueryFailed={hasQueryFailed}
          isQuerying={isQuerying}
          filterQuery={filterQuery}
          refetchLinks={refetchLinks}
          setFilterQuery={setFilterQuery}
          openRegisterModal={() => setIsModalEnabled(true)}
          openUpdatingModal={(link: Link) => {
            setUpdatingLink(link);
            setIsModalEnabled(true);
          }}
        />
        <ActionButton
          additionalStyles="fixed bottom-[16px] left-[50%] translate-x-[-50%] z-1 shadow-lg"
          action={() => setIsModalEnabled(true)}
          filled={true}
        >
          <div className="flex gap-badge-gap">
            <span className="font-[500]">Registrar Novo Link</span>
            <LinkIcon width={20} />
          </div>
        </ActionButton>
      </div>
    </>
  );
}

export default App;
