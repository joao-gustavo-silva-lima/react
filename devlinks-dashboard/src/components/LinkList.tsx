import useLinkAction from "../hooks/useLinkActions.hook";
import type { Link, PREDEFINED_CATEGORIES, Query } from "../types/links.types";
import { ExternalLink, LinkIcon, SquarePen, Trash2 } from "lucide-react";

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
    <ul className="grid grid-cols-[repeat(auto-fit,250px)] justify-center gap-card-gap w-full mt-[25px]">
      {filteredLinks.map((link) => (
        <li
          className="flex flex-col justify-between gap-[15px] p-container w-[250px] max-w-[250px] rounded-surface bg-surface main-border"
          key={link.id}
        >
          <div className="flex flex-col gap-[5px]">
            <span className="font-[600] text-h2 truncate">{link.title}</span>
            <span
              className="flex flex-nowrap items-center gap-[5px] font-[500] text-brand underline hover:cursor-pointer truncate"
              onClick={() => handleRedirection(link)}
            >
              <LinkIcon width={15} color="#485a81" />
              {link.url}
            </span>
            <span
              style={{
                backgroundColor:
                  categoryColorsMap.get(
                    link.category as (typeof PREDEFINED_CATEGORIES)[number],
                  ) ?? "#000",
              }}
              className={`font-[500] text-body text-center rounded-badge capitalize animated-button`}
              onClick={() => handleQueryChange("category", link.category)}
            >
              {link.category}
            </span>
            {link.tags.length > 0 && (
              <ul className="flex flex-wrap gap-[0.5rem]">
                {link.tags.map((tag, i) => (
                  <li key={i}>
                    <span className="text-body text-text-secondary">
                      #{tag}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <span className="font-[500] text-body">Clicks: {link.clicks}</span>
          </div>
          <div className="flex flex-nowrap gap-[10px]">
            <button
              className="flex flex-nowrap justify-center items-center gap-[5px] rounded-input bg-brand text-body font-[500] px-[10px] py-[2.5px] w-full animated-button"
              type="button"
              onClick={() => handleRedirection(link)}
            >
              <span>Acessar</span>
              <ExternalLink width={20} />
            </button>
            <button
              className="animated-button main-border rounded-input p-[5px]"
              type="button"
              onClick={() => openUpdatingModal(link)}
            >
              <SquarePen width={20} />
            </button>
            <button
              className="animated-button main-border rounded-input p-[5px]"
              type="button"
              onClick={() => handleLinkDeletion(link)}
            >
              <Trash2 width={20} />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
const categoryColorsMap = new Map<
  (typeof PREDEFINED_CATEGORIES)[number],
  string
>([
  ["desenvolvimento", "#485a81"],
  ["design", "#ec4899"],
  ["documentação", "#16a34a"],
  ["ferramentas", "#ea580c"],
  ["carreira", "#7c3aed"],
  ["estudo", "#eab308"],
  ["pessoal", "#0d9488"],
]);

export default LinkList;
