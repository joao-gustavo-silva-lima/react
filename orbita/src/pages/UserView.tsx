import { useParams } from "react-router-dom";
import { useFetchUserByUsername, useFetchUserProfile } from "../hooks/useUser";
import z, { ZodType } from "zod";
import {
  ForwardIcon,
  LinkIcon,
  MailIcon,
  PhoneIcon,
  type LucideIcon,
} from "lucide-react";
import type { Link as LinkT } from "../schemas/Link.schema";
import { useState } from "react";
import ShareModal from "../components/ShareModal";

export default function UserView() {
  const { username } = useParams();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const isProfileView = username === undefined;

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
          <button type="button">
            <ForwardIcon />
          </button>
        </div>
        <ul>
          {user.links.map((link) => (
            <li key={link.id}>
              <Link link={link} />
            </li>
          ))}
        </ul>
        <span>
          {"\u{1F300}"} Feito com <span>Orbita</span>
        </span>
      </main>
      <ShareModal
        username={user.username}
        isOpen={isShareModalOpen}
        setIsOpen={setIsShareModalOpen}
      />
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
      <a href={link.ref}>
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
