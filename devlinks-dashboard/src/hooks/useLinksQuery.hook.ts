import { useEffect, useState } from "react";
import type { Link, Query } from "../types/links.types";
import LinksAPI from "../api/links.api";

export default function useLinksQuery() {
  const [isQuerying, setIsQuerying] = useState(false);
  const [errors, setErrors] = useState<string>();
  const [links, setLinks] = useState<Link[]>([]);

  function fetchLinks() {
    setIsQuerying(true);

    LinksAPI.fetchLinks()
      .then(async (res) => {
        if (res.ok) {
          return await res.json();
        }

        throw null;
      })
      .then((fetchedLinks) => setLinks(fetchedLinks))
      .catch((_) => setErrors("Ocorreu um erro ao tentar exibir os links..."))
      .finally(() => setIsQuerying(false));
  }

  useEffect(() => {
    fetchLinks();
  }, []);

  return { isQuerying, errors, links, refetchLinks: fetchLinks };
}
