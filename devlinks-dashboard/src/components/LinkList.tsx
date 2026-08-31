import useLinkAction from "../hooks/useLinkActions.hook";
import type { Link, PREDEFINED_CATEGORIES, Query } from "../types/links.types";
import {
  ExternalLink,
  LinkIcon,
  LoaderCircle,
  SquarePen,
  Trash2,
} from "lucide-react";
import Overlay from "./Overlay";

function LinkList({
  links,
  hasQueryFailed,
  isQuerying,
  filterQuery,
  refetchLinks,
  setFilterQuery,
  openRegisterModal,
  openUpdatingModal,
}: {
  links: Link[];
  filterQuery: Query;
  isQuerying: boolean;
  hasQueryFailed: boolean;
  refetchLinks: () => void;
  openRegisterModal: () => void;
  setFilterQuery: (query: Query) => void;
  openUpdatingModal: (link: Link) => void;
}) {
  const { isActing, redirectByLinkID, deleteLinkByID } = useLinkAction();

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

  if (!isQuerying && hasQueryFailed) {
    return (
      <p className="w-full text-center">
        Ocorreu um erro ao buscar os links. Tente novamente{" "}
        <a className="underline text-brand" href="/">
          aqui
        </a>
        .
      </p>
    );
  }

  if (!isQuerying && filteredLinks.length === 0) {
    return (
      <p className="w-full text-center">
        Não há links registrados. Que tal{" "}
        <span
          onClick={openRegisterModal}
          className="underline text-brand hover:cursor-pointer"
        >
          registrar um novo?
        </span>
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-[repeat(auto-fit,250px)] justify-center gap-card-gap w-full mt-[25px]">
      {isActing && (
        <Overlay>
          <div className="animate-spin">
            <LoaderCircle size={50} color="#1f6feb" />
          </div>
        </Overlay>
      )}
      {isQuerying ? (
        <>
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </>
      ) : (
        filteredLinks.map((link) => (
          <li
            className="flex flex-col justify-between gap-[15px] p-container w-[250px] max-w-[250px] rounded-surface bg-surface main-border"
            key={link.id}
          >
            <div className="flex flex-col w-full gap-[5px]">
              <span className="font-[600] text-h2 truncate">{link.title}</span>
              <div className="flex flex-row flex-nowrap items-center gap-[5px] hover:cursor-pointer">
                <LinkIcon className="min-w-fit" size={15} color="#1f6feb" />
                <span
                  className="font-[500] text-brand underline truncate"
                  onClick={() => handleRedirection(link)}
                >
                  {link.url}
                </span>
              </div>
              <span
                style={{
                  backgroundColor:
                    categoryColorsMap.get(
                      link.category as (typeof PREDEFINED_CATEGORIES)[number],
                    ) ?? "#485a81",
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
              <span className="font-[500] text-body">
                Clicks: {link.clicks}
              </span>
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
        ))
      )}
    </ul>
  );
}

function CardSkeleton() {
  return (
    <li className="relative aspect-square w-[250px] max-w-[250px] flex flex-col justify-between bg-surface rounded-surface p-container gap-container">
      <div className="flex flex-col gap-container">
        <span className="animate-pulse w-full h-[32px] bg-border-main rounded-input"></span>
        <span className="animate-pulse w-[75%] h-[26px] bg-border-main rounded-input"></span>
        <span className="animate-pulse w-full h-[26px] bg-border-main rounded-input"></span>
      </div>
      <div className="flex flex-nowrap gap-[10px]">
        <span className="animate-pulse w-[40%] h-[24px] bg-border-main rounded-input"></span>
        <span className="animate-pulse flex-1 h-[24px] bg-border-main rounded-input"></span>
        <span className="animate-pulse flex-1 h-[24px] bg-border-main rounded-input"></span>
      </div>
    </li>
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
