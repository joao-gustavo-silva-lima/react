import {
  useNavigate,
  useParams,
  Link as LinkTo,
  Outlet,
} from "react-router-dom";
import {
  useFetchUserByUsername,
  useFetchUserProfile,
  useLogoutUser,
} from "../hooks/useUser";
import z, { ZodType } from "zod";
import {
  ForwardIcon,
  LinkIcon,
  LogOutIcon,
  MailIcon,
  OrbitIcon,
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

  const privateUserQuery = useFetchUserProfile();
  const isProfileView = privateUserQuery.data?.username === username!;
  const publicUserQuery = useFetchUserByUsername(username!, !isProfileView);
  const {
    data: user,
    isFetching,
    isError,
    error,
  } = isProfileView ? privateUserQuery : publicUserQuery;

  const { mutate: logoutUser, isPending: isLoggingUserOut } = useLogoutUser();

  const navigate = useNavigate();

  const onLogout = () => {
    if (isLinkModalOpen || isShareModalOpen) {
      alert(
        "Aguarde a conclusão de outra ação antes de prosseguir com o logout...",
      );
      return;
    }

    if (!confirm(`Deseja fazer logout?`)) {
      return;
    }

    logoutUser(undefined, {
      onError: (error) => {
        const errorMessage = API_MESSAGES.get(error.code);

        if (errorMessage === undefined) {
          alert(
            "Um erro inesperado ocorreu ao tentar fazer login. Tente novamente mais tarde.",
          );
          return;
        }

        alert(errorMessage);
      },
      onSuccess: (data) => {
        navigate("/login");
        alert(
          API_MESSAGES.get(data.code) ?? "O logout foi realizado com sucesso.",
        );
      },
    });
  };

  if (isFetching) {
    return <p>Carregando perfil do usuário...</p>;
  }

  if (error?.status === 404) {
    return <p>Usuário não encontrado.</p>;
  }

  if (isError || user == null) {
    return <p>Ocorreu um erro ao tentar carregar o perfil do usuário.</p>;
  }

  return (
    <>
      <main>
        <div>
          <span>{user.name}</span>
          <span>@{user.username}</span>
          <div>
            {isProfileView && (
              <LinkTo to={`/u/${user.username}/editar`}>
                <SquarePenIcon />
              </LinkTo>
            )}
            <button type="button" onClick={() => setIsShareModalOpen(true)}>
              <ForwardIcon />
            </button>
            {isProfileView && (
              <>
                <LinkTo to={`/u/${user.username}/excluir`}>
                  <TrashIcon />
                </LinkTo>
                <button
                  type="button"
                  onClick={isLoggingUserOut ? undefined : onLogout}
                >
                  <LogOutIcon />
                </button>
              </>
            )}
          </div>
        </div>
        {user.links.length === 0 && (
          <span>
            Parece que esse hub não possui nenhum link em Orbita.{" "}
            {isProfileView && (
              <button type="button" onClick={() => setIsLinkModalOpen(true)}>
                Comece por aqui!
              </button>
            )}
          </span>
        )}
        <ul>
          {user.links.map((link) => (
            <li key={link.id}>
              <Link
                link={link}
                openEditingModal={() => {
                  setUpdatingLink(link);
                  setIsLinkModalOpen(true);
                }}
                isEditable={isProfileView}
              />
            </li>
          ))}
        </ul>
        {isProfileView && user.links.length < 10 && (
          <button type="button" onClick={() => setIsLinkModalOpen(true)}>
            Adicionar Link
          </button>
        )}
        <span>
          <OrbitIcon /> Feito com <span>Orbita</span>
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
      {isProfileView && <Outlet context={{ user }} />}
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

function Link({
  link,
  isEditable,
  openEditingModal,
}: {
  link: LinkT;
  openEditingModal: () => void;
  isEditable: boolean;
}) {
  const Icon = getLinkIcon(link.ref);

  const { mutate: deleteLink, isPending: isDeletingLink } = useDeleteLink();

  const onDeleteLink = (link: Link) => {
    if (isDeletingLink) {
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

  if (Icon === null) {
    return (
      <>
        <a rel="noopener noreferrer" target="_blank" href={link.ref}>
          <img
            src={`https://www.google.com/s2/favicons?domain=${link.ref}&sz=64`}
            alt="Imagem do favicon relativo ao domínio da url contida no link."
            width={25}
          />
          <span>{link.title}</span>
        </a>
        {isEditable && (
          <>
            <button type="button" onClick={openEditingModal}>
              <SquarePenIcon />
            </button>
            <button type="button" onClick={() => onDeleteLink(link)}>
              <TrashIcon />
            </button>
          </>
        )}
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={async () => await navigator.clipboard.writeText(link.ref)}
      >
        <Icon />
        <span>{link.title}</span>
      </button>
      {isEditable && (
        <>
          <button type="button" onClick={openEditingModal}>
            <SquarePenIcon />
          </button>
          <button type="button" onClick={() => onDeleteLink(link)}>
            <TrashIcon />
          </button>
        </>
      )}
    </>
  );
}
