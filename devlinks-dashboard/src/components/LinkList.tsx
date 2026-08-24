import type { Link } from "../types/links.types";

function Badge({ tag }: { tag: string }) {
  return <li>{tag}</li>;
}

function LinkList(props: {
  links: Link[];
  isQuerying: boolean;
  errors?: string;
}) {
  if (props.isQuerying) {
    return <p>Carregando Links...</p>;
  }

  if (props.errors) {
    return <p>{props.errors}</p>;
  }

  return (
    <ul>
      {props.links.map((link, i) => (
        <li key={i}>
          <span>{link.title}</span>
          <span>{link.url}</span>
          {link.tags.length > 0 && (
            <ul>
              {link.tags.map((tag, i) => (
                <Badge key={i} tag={tag} />
              ))}
            </ul>
          )}
          <span>Clicks: {link.clicks}</span>
        </li>
      ))}
    </ul>
  );
}

export default LinkList;
