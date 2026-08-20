import { useCallback, useEffect, useState } from "react";
import type { Link, Query } from "../types/links.types";
import LinksAPI from "../api/links.api";

export default function useLinks(query: Query = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState<string>();
  const [links, setLinks] = useState<Link[]>([]);

  const fetchLinks = useCallback((query: Query = {}) => {
    setIsLoading(true);

    LinksAPI.fetchLinks(query)
      .then(async (res) => await res.json())
      .then((fetchedLinks) => setLinks(fetchedLinks))
      .catch((_) => setErr("Ocorreu um erro ao tentar exibir os links..."))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchLinks(query);
  }, []);

  return { isLoading, err, links, refetchLinks: fetchLinks };
}
