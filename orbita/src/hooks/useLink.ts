import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Link, LinkInput, LinkUpdateInput } from "../schemas/Link.schema";
import * as linkAPI from "../api/Link.api";
import HttpError from "../common/classes/HttpError";
import type { User } from "../schemas/User.schema";
import { type APIJSONResponse } from "../common/types/api.types";

const userLinksQueryKey = ["user", "profile", "links"] as const;
const linkQueryKey = (id: number) => [...userLinksQueryKey, id] as const;

export function useCreateLink() {
  const queryClient = useQueryClient();

  return useMutation<Link, HttpError, LinkInput>({
    mutationKey: [...userLinksQueryKey, "create"],
    mutationFn: (payload: LinkInput) => linkAPI.createLink(payload),
    onMutate: (newLink) => {
      const now = new Date().toLocaleDateString();

      queryClient.setQueryData<User>(
        ["user", "profile"],
        (user) =>
          user && {
            ...user,
            links: [
              ...user.links,
              {
                id: -1,
                authorUsername: user.username,
                createdAt: now,
                lastEdition: now,
                ...newLink,
              },
            ],
          },
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
    },
  });
}

export function useUpdateLink() {
  const queryClient = useQueryClient();

  return useMutation<Link, HttpError, { id: number; payload: LinkInput }>({
    mutationKey: [...userLinksQueryKey, "update"],
    mutationFn: ({ id, payload }: { id: number; payload: LinkUpdateInput }) =>
      linkAPI.updateLink(id, payload),
    onMutate: ({ id, payload: updatedLink }) => {
      queryClient.setQueryData<User>(
        ["user", "profile"],
        (user) =>
          user && {
            ...user,
            links: user.links.map((link) =>
              link.id === id ? { ...link, ...updatedLink } : link,
            ),
          },
      );
    },
  });
}

export function useDeleteLink() {
  const queryClient = useQueryClient();

  return useMutation<APIJSONResponse, HttpError, number>({
    mutationKey: [...userLinksQueryKey, "delete"],
    mutationFn: (id: number) => linkAPI.deleteLink(id),
    onMutate: (id) => {
      queryClient.setQueryData<User>(
        ["user", "profile"],
        (user) =>
          user && {
            ...user,
            links: user.links.filter((link) => link.id !== id),
          },
      );
    },
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: linkQueryKey(id), exact: true });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
    },
  });
}
