import { useEffect, useState } from "react";
import type { Link } from "../types/links.types";
import LinksAPI from "../api/links.api";

export default function useLinksQuery() {
  const [isQuerying, setIsQuerying] = useState(false);
  const [hasQueryFailed, setHasQueryFailed] = useState<boolean>(false);
  const [links, setLinks] = useState<Link[]>([]);

  function fetchLinks() {
    setIsQuerying(true);

    LinksAPI.fetchLinks()
      .then(async (res) => {
        if (res.ok) {
          setHasQueryFailed(false);
          return await res.json();
        }

        throw null;
      })
      .then((fetchedLinks) => setLinks(fetchedLinks))
      .catch((_) => setHasQueryFailed(true))
      .finally(() => setIsQuerying(false));
  }

  useEffect(() => {
    fetchLinks();
  }, []);

  return {
    isQuerying,
    hasQueryFailed,
    links,
    refetchLinks: fetchLinks,
  };
}
