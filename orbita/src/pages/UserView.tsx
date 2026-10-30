import {
  useNavigate,
  useParams,
  Link as LinkTo,
  Outlet,
  useOutlet,
} from "react-router-dom";
import {
  useFetchUserByUsername,
  useFetchUserProfile,
  useLogoutUser,
} from "../hooks/useUser";
import z, { ZodType } from "zod";
import {
  ChevronRightIcon,
  CopyIcon,
  ExternalLinkIcon,
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
import Overlay from "../components/Overlay";

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

  const isOutlet = useOutlet() !== null;

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
      <main className="contained flex flex-col items-center  min-h-dvh pt-[160px] gap-container pb-[60px]">
        <div className="relative flex flex-col items-center p-container pt-[50px] rounded-card bg-linear-to-b from-elevated to-transparent">
          <div className="absolute top-[-40px] flex justify-center items-center w-[80px] aspect-square rounded-full bg-linear-to-br from-primary to-accent mb-control">
            <span className="text-center text-2xl font-bold">
              {user.name.trim()[0].toUpperCase() ?? "@"}
            </span>
          </div>
          <span className="text-lg font-bold">{user.name}</span>
          <span className="text-muted font-medium">@{user.username}</span>
          <div
            className="flex flex-nowrap items-center justify-center mt-card gap-element
          
            [&>*]:bg-elevated [&>*]:p-[7.5px] [&>*]:rounded-control
          "
          >
            {isProfileView && (
              <LinkTo
                className="button-behaviour hover:text-primary active:text-primary-hover"
                to={`/u/${user.username}/editar`}
              >
                <SquarePenIcon />
              </LinkTo>
            )}
            <button
              className="button-behaviour hover:text-primary active:text-primary-hover"
              type="button"
              onClick={() => setIsShareModalOpen(true)}
            >
              <ForwardIcon />
            </button>
            {isProfileView && (
              <>
                <LinkTo
                  className="button-behaviour hover:text-primary active:text-primary-hover"
                  to={`/u/${user.username}/excluir`}
                >
                  <TrashIcon />
                </LinkTo>
                <button
                  className="button-behaviour hover:text-primary active:text-primary-hover"
                  type="button"
                  onClick={isLoggingUserOut ? undefined : onLogout}
                >
                  <LogOutIcon />
                </button>
              </>
            )}
          </div>
        </div>
        {user.links.length === 0 ? (
          <span className="text-center text-muted">
            Parece que esse hub não possui nenhum link em Orbita.{" "}
            {isProfileView && (
              <button
                className="text-primary font-medium hover:underline hover:cursor-pointer"
                type="button"
                onClick={() => setIsLinkModalOpen(true)}
              >
                Comece por aqui!
              </button>
            )}
          </span>
        ) : (
          <ul className="flex flex-col w-full max-w-[400px] gap-element">
            {user.links.map((link) => (
              <Link
                key={`user-link-${link.id}`}
                link={link}
                openEditingModal={() => {
                  setUpdatingLink(link);
                  setIsLinkModalOpen(true);
                }}
                isEditable={isProfileView}
              />
            ))}
          </ul>
        )}
        {isProfileView && user.links.length < 10 && (
          <button
            className="button-behaviour--filled w-full max-w-[400px] rounded-card"
            type="button"
            onClick={() => setIsLinkModalOpen(true)}
          >
            Adicionar Link
          </button>
        )}
        <div className="absolute bottom-container flex flex-nowrap gap-[5px]">
          <OrbitIcon className="text-primary" />{" "}
          <span className="text-muted">
            Feito com <span className="text-text font-medium">Orbita</span>
          </span>
        </div>
      </main>
      {isShareModalOpen && (
        <Overlay>
          <ShareModal
            username={user.username}
            closeModal={() => setIsShareModalOpen(false)}
          />
        </Overlay>
      )}
      {isProfileView && isLinkModalOpen && (
        <Overlay>
          <LinkModal
            updatingLink={updatingLink}
            closeModal={() => {
              setUpdatingLink(null);
              setIsLinkModalOpen(false);
            }}
          />
        </Overlay>
      )}
      {isProfileView && isOutlet && (
        <Overlay>
          <Outlet context={{ user }} />
        </Overlay>
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

function Link({
  link,
  isEditable,
  openEditingModal,
}: {
  link: LinkT;
  openEditingModal: () => void;
  isEditable: boolean;
}) {
  const className = `flex flex-nowrap justify-between items-center gap-element bg-elevated flex-1 rounded-card p-control font-medium button-behaviour [&>div]:flex [&>div]:gap-control [&>div]:[&>span]:truncate`;

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

  return (
    <li className="flex flex-nowrap gap-control">
      {Icon === null ? (
        <a
          className={className}
          rel="noopener noreferrer"
          target="_blank"
          href={link.ref}
        >
          <div>
            <img
              src={`https://www.google.com/s2/favicons?domain=${link.ref}&sz=64`}
              alt="Imagem do favicon relativo ao domínio da url contida no link."
              width={25}
            />
            <span>{link.title}</span>
          </div>
          <ExternalLinkIcon size={20} />
        </a>
      ) : (
        <button
          className={className}
          type="button"
          onMouseUp={async () => {
            await navigator.clipboard.writeText(link.ref);
            alert(
              `O conteúdo de "${link.title}" foi copiado para a área de transferência.`,
            );
          }}
        >
          <div>
            <Icon />
            <span>{link.title}</span>
          </div>
          <CopyIcon size={18} />
        </button>
      )}

      {isEditable && (
        <>
          <button
            className="button-behaviour text-muted"
            type="button"
            onClick={openEditingModal}
          >
            <SquarePenIcon size={20} />
          </button>
          <button
            className="button-behaviour text-muted"
            type="button"
            onClick={() => onDeleteLink(link)}
          >
            <TrashIcon size={20} />
          </button>
        </>
      )}
    </li>
  );
}
