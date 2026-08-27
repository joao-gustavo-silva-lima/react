import useLinkAction from "../hooks/useLinkActions.hook";
import type { Link, Query } from "../types/links.types";
import { ExternalLink, SquarePen, Trash2 } from "lucide-react";

function LinkList({
  links,
  errors,
  isQuerying,
  filterQuery,
  refetchLinks,
  setFilterQuery,
  openUpdatingModal,
}: {
  links: Link[];
  errors?: string;
  filterQuery: Query;
  isQuerying: boolean;
  refetchLinks: () => void;
  setFilterQuery: (query: Query) => void;
  openUpdatingModal: (link: Link) => void;
}) {
  const { redirectByLinkID, deleteLinkByID } = useLinkAction();

  const filteredLinks = links.filter((link) => {
    const matchesTitle =
      !filterQuery.title ||
      filterQuery.title === "" ||
      link.title.toLowerCase().includes(filterQuery.title.toLowerCase());

    const matchesTags =
      !filterQuery.tag ||
      filterQuery.tag === "" ||
      link.tags.includes(filterQuery.tag);

    const matchesCategory =
      !filterQuery.category ||
      filterQuery.category === "" ||
      link.category.toLowerCase() === filterQuery.category.toLowerCase();

    return matchesTitle && matchesTags && matchesCategory;
  });

  function handleRedirection(link: Link) {
    const confirmRedirection = confirm(
      `Deseja abrir '${link.url}' em uma nova aba?`,
    );

    if (!confirmRedirection) {
      return;
    }

    redirectByLinkID(link.id).then((result) => {
      alert(result.message);

      if (result.success) {
        open(result.data!.redirectURL, "_blank");
        refetchLinks();
      }
    });
  }

  function handleLinkDeletion(link: Link) {
    const confirmDeletion = confirm(`Deseja excluir o link "${link.title}"?`);

    if (!confirmDeletion) {
      return;
    }

    deleteLinkByID(link.id).then((result) => {
      alert(result.message);

      if (result.success) {
        refetchLinks();
      }
    });
  }

  function handleQueryChange(key: keyof Query, value: string) {
    setFilterQuery({ ...filterQuery, [key]: value });
  }

  if (isQuerying) {
    return <p>Carregando Links...</p>;
  }

  if (errors) {
    return <p>{errors}</p>;
  }

  if (filteredLinks.length === 0) {
    return <p>Nenhum link foi encontrado...</p>;
  }

  return (
    <ul className="flex flex-col gap-[15px]">
      {filteredLinks.map((link) => (
        <li className="flex flex-col" key={link.id}>
          <span>{link.title}</span>
          <span>{link.url}</span>
          <span onClick={() => handleQueryChange("category", link.category)}>
            {link.category}
          </span>
          {link.tags.length > 0 && (
            <ul>
              {link.tags.map((tag, i) => (
                <li key={i}>
                  <span>#{tag}</span>
                </li>
              ))}
            </ul>
          )}
          <span>Clicks: {link.clicks}</span>
          <div>
            <button type="button" onClick={() => handleRedirection(link)}>
              <ExternalLink />
            </button>
            <button type="button" onClick={() => openUpdatingModal(link)}>
              <SquarePen />
            </button>
            <button type="button" onClick={() => handleLinkDeletion(link)}>
              <Trash2 />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default LinkList;
