import type { Link } from "../types/links.types";
import { SquarePen, Trash2 } from "lucide-react";

function LinkList({
  links,
  errors,
  isQuerying,
  openUpdatingModal,
}: {
  links: Link[];
  errors?: string;
  isQuerying: boolean;
  openUpdatingModal: (link: Link) => void;
}) {
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
            <button type="button">
              <Trash2 />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default LinkList;
