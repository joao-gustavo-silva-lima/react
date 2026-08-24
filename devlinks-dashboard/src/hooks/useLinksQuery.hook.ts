import { useEffect, useState } from "react";
import type { Link, Query } from "../types/links.types";
import LinksAPI from "../api/links.api";

export default function useLinksQuery(query: Query = {}) {
  const [isQuerying, setIsQuerying] = useState(false);
  const [errors, setErrors] = useState<string>();
  const [links, setLinks] = useState<Link[]>([]);

  function fetchLinks(query: Query = {}) {
    setIsQuerying(true);

    LinksAPI.fetchLinks(query)
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
    fetchLinks(query);
  }, []);

  return { isQuerying, errors, links, refetchLinks: fetchLinks };
}
