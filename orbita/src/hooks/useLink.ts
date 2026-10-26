import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Link, LinkInput, LinkUpdateInput } from "../schemas/Link.schema";
import * as linkAPI from "../api/Link.api";
import HttpError from "../common/classes/HttpError";
import type { User } from "../schemas/User.schema";

const userLinksQueryKey = ["user", "profile", "links"] as const;
const linkQueryKey = (id: number) => [...userLinksQueryKey, id] as const;

export function useCreateLink() {
  const queryClient = useQueryClient();

  return useMutation<Link, HttpError, LinkInput>({
    mutationKey: [...userLinksQueryKey, "create"],
    mutationFn: (payload: LinkInput) => linkAPI.createLink(payload),
    onSuccess: (newLink) => {
      queryClient.setQueryData<User>(
        ["user", "profile"],
        (user) =>
          user && {
            ...user,
            links: [...user.links, newLink],
          },
      );
    },
  });
}

export function useFetchLinks() {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: userLinksQueryKey,
    queryFn: async () => {
      const links = await linkAPI.fetchLinks();

      for (const link of links) {
        queryClient.setQueryData(linkQueryKey(link.id), link);
      }

      return links;
    },
  });
}

export function useFetchLink(id: number) {
  return useQuery({
    queryKey: linkQueryKey(id),
    queryFn: () => linkAPI.fetchLink(id),
    enabled: Number.isInteger(id) && id > 0,
  });
}

export function useUpdateLink() {
  const queryClient = useQueryClient();

  return useMutation<Link, HttpError, { id: number; payload: LinkInput }>({
    mutationKey: [...userLinksQueryKey, "update"],
    mutationFn: ({ id, payload }: { id: number; payload: LinkUpdateInput }) =>
      linkAPI.updateLink(id, payload),
    onSuccess: (updatedLink) => {
      queryClient.setQueryData<User>(
        ["user", "profile"],
        (user) =>
          user && {
            ...user,
            links: user.links.map((link) =>
              link.id === updatedLink.id ? updatedLink : link,
            ),
          },
      );
    },
  });
}

export function useDeleteLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [...userLinksQueryKey, "delete"],
    mutationFn: (id: number) => linkAPI.deleteLink(id),
    onSuccess: (_response, id) => {
      queryClient.removeQueries({ queryKey: linkQueryKey(id), exact: true });
      queryClient.setQueryData<Link[]>(userLinksQueryKey, (links) =>
        links?.filter((link) => link.id !== id),
      );
    },
  });
}
