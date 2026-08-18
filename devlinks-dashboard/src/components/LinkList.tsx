import type { Link } from "../types/links.types";

function Badge({ tag }: { tag: string }) {
  return <li>{tag}</li>;
}

function LinkList(props: { links: Link[]; isLoading: boolean; err?: Error }) {
  if (props.isLoading) {
    return <p>Carregando Links...</p>;
  }

  if (props.err) {
    return <p>{props.err.message}</p>;
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
