import { useParams } from "react-router-dom";
import { useFetchUserByUsername, useFetchUserProfile } from "../hooks/useUser";
import z, { ZodType } from "zod";
import {
  ForwardIcon,
  LinkIcon,
  MailIcon,
  PhoneIcon,
  SquarePenIcon,
  TrashIcon,
  type LucideIcon,
} from "lucide-react";
import type { Link, Link as LinkT } from "../schemas/Link.schema";
import { useState } from "react";
import ShareModal from "../components/ShareModal";
import LinkModal from "../components/LinkModal";
import { useDeleteLink } from "../hooks/useLink";
import { API_MESSAGES } from "../api/messages.api";

export default function UserView() {
  const { username } = useParams();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [updatingLink, setUpdatingLink] = useState<Link | null>(null);

  const isProfileView = username === undefined;

  const { mutate: deleteLink, isPending: isDeletingLink } = useDeleteLink();

  const onDeleteLink = (link: Link) => {
    if (isDeletingLink || isLinkModalOpen || isShareModalOpen) {
      alert(
        "Aguarde a conclusão de outra ação antes de prosseguir com a remoção do link...",
      );
      return;
    }

    if (!confirm(`Deseja remover o link "${link.title}"?`)) {
      return;
    }

    deleteLink(link.id, {
      onError: (error) => {
        const errorMessage = API_MESSAGES.get(error.code);

        if (errorMessage === undefined) {
          alert(
            "Um erro inesperado ocorreu ao tentar remover o link. Tente novamente mais tarde.",
          );
          return;
        }

        alert(errorMessage);
      },
      onSuccess: (data) => {
        alert(
          API_MESSAGES.get(data.code) ?? "O link foi removido com sucesso.",
        );
      },
    });
  };

  const {
    data: user,
    isFetching,
    isError,
    error,
  } = isProfileView ? useFetchUserProfile() : useFetchUserByUsername(username);

  if (isFetching) {
    return <p>Carregando perfil do usuário...</p>;
  }

  if (error?.status === 404) {
    return <p>Usuário não encontrado.</p>;
  } else if (error?.status === 401 || error?.status === 403) {
    document.location = `${document.location.origin}/login`;

    return <p>O que você está fazendo aqui?!</p>;
  }

  if (isError || user === undefined) {
    return <p>Ocorreu um erro ao tentar carregar o perfil do usuário.</p>;
  }

  return (
    <>
      <main>
        <div>
          <span>{user.name}</span>
          <span>@{user.username}</span>
          <button type="button" onClick={() => setIsShareModalOpen(true)}>
            <ForwardIcon />
          </button>
        </div>
        <ul>
          {user.links.map((link) => (
            <li key={link.id}>
              <Link link={link} />
              <button
                type="button"
                onClick={() => {
                  setUpdatingLink(link);
                  setIsLinkModalOpen(true);
                }}
              >
                <SquarePenIcon />
              </button>
              <button type="button" onClick={() => onDeleteLink(link)}>
                <TrashIcon />
              </button>
            </li>
          ))}
        </ul>
        {isProfileView && user.links.length < 10 && (
          <button type="button" onClick={() => setIsLinkModalOpen(true)}>
            Adicionar Link
          </button>
        )}
        <span>
          {"\u{1F300}"} Feito com <span>Orbita</span>
        </span>
      </main>
      {isShareModalOpen && (
        <ShareModal
          username={user.username}
          closeModal={() => setIsShareModalOpen(false)}
        />
      )}
      {isProfileView && isLinkModalOpen && (
        <LinkModal
          updatingLink={updatingLink}
          closeModal={() => {
            setUpdatingLink(null);
            setIsLinkModalOpen(false);
          }}
        />
      )}
    </>
  );
}

function getLinkIcon(ref: string) {
  const relations: [ZodType, LucideIcon | null][] = [
    [z.url(), null],
    [z.email(), MailIcon],
    [z.string().regex(/^\+?[\d|\s]+$/), PhoneIcon],
  ];

  for (const [schema, Icon] of relations) {
    if ((schema as ZodType).safeParse(ref).success) {
      return Icon;
    }
  }

  return LinkIcon;
}

function Link({ link }: { link: LinkT }) {
  const Icon = getLinkIcon(link.ref);

  if (Icon === null) {
    return (
      <a rel="noopener noreferrer" target="_blank" href={link.ref}>
        <img
          src={`https://www.google.com/s2/favicons?domain=${link.ref}&sz=64`}
          alt="Imagem do favicon relativo ao domínio da url contida no link."
          width={25}
        />
        <span>{link.title}</span>
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={async () => await navigator.clipboard.writeText(link.ref)}
    >
      <Icon />
      <span>{link.title}</span>
    </button>
  );
}
