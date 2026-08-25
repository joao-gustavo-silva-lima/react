import useLinkAction from "../hooks/useLinkActions.hook";
import type { Link } from "../types/links.types";
import { SquarePen, Trash2 } from "lucide-react";

function LinkList({
  links,
  errors,
  isQuerying,
  refetchLinks,
  openUpdatingModal,
}: {
  links: Link[];
  errors?: string;
  isQuerying: boolean;
  refetchLinks: () => void;
  openUpdatingModal: (link: Link) => void;
}) {
  const { deleteLinkByID } = useLinkAction();

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

  if (isQuerying) {
    return <p>Carregando Links...</p>;
  }

  if (errors) {
    return <p>{errors}</p>;
  }

  return (
    <ul className="flex flex-col gap-[15px]">
      {links.map((link) => (
        <li className="flex flex-col" key={link.id}>
          <span>{link.title}</span>
          <span>{link.url}</span>
          <span>{link.category}</span>
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
