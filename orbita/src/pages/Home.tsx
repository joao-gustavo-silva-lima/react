import {
  ForwardIcon,
  LeafIcon,
  Link2Icon,
  UserIcon,
  ZapIcon,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <main className="contained flex flex-wrap items-center justify-between gap-container w-full min-h-dvh">
        <div className="flex flex-col flex-1 max-w-[450px] gap-container">
          <p className="text-hero/14 font-bold">
            Todos os seus <span className="text-primary">links e contatos</span>{" "}
            em <span className="text-primary">um só lugar.</span>
          </p>
          <p className="font-medium text-justify">
            Orbita é o seu profile hubing. Reúna seus links, redes sociais,
            contatos e muito mais em um hub simples e rápido.
          </p>
          <Link className="button-behaviour--filled" to="/cadastro">
            Comece agora — é grátis
          </Link>
        </div>
        <img
          className="flex-1 max-w-[500px]"
          src="../../public/hero.ignore.png"
          alt="Imagem principal da página principal."
        />
      </main>
      <section className="bg-surface m-auto" id="recursos">
        <div className="contained flex flex-col gap-container ">
          <h2 className="text-2xl font-bold">Por que Orbita?</h2>
          <CardList
            keyPrefix="section--resources"
            list={[
              [ZapIcon, "Rápido", "Crie seu hub em minutos."],
              [LeafIcon, "Simple", "Sem complicação, sem mistério."],
              [ForwardIcon, "Compartilhar", "Seu perfil onde quiser."],
            ]}
          />
        </div>
      </section>
      <section className="m-auto" id="funcionamento">
        <div className="flex flex-col gap-container contained">
          <h2 className="text-2xl font-bold">Com funciona?</h2>
          <p className="text-muted">
            Em poucos passos, você já tem seu hub no ar.
          </p>
          <CardList
            keyPrefix="section--workings"
            list={[
              [UserIcon, "Cadastre-se", "Crie sua conta em segundos."],
              [
                Link2Icon,
                "Adicione seus links",
                "Reúna suas redes, contatos, e o que mais quiser.",
              ],
              [ForwardIcon, "Compartilhe", "Seu perfil pronto para o mundo."],
            ]}
            ordered={true}
          />
        </div>
      </section>
    </>
  );
}

function CardList({
  list,
  keyPrefix,
  ordered = false,
}: {
  list: [LucideIcon, string, string][];
  ordered?: boolean;
  keyPrefix: string;
}) {
  const ListElement = ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className: string;
  }) =>
    ordered ? (
      <ol className={className}>{children}</ol>
    ) : (
      <ul className={className}>{children}</ul>
    );

  return (
    <ListElement className="flex items-center gap-container justify-between">
      {list.map(([Icon, title, description], index) => (
        <li
          className={`flex flex-${ordered ? "col" : "row"} gap-element`}
          key={`${keyPrefix}--${index}`}
        >
          <div className="bg-elevated w-fit p-element rounded-card">
            <Icon className="text-primary" size={22.5} />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">
              {ordered && `${index + 1}. `}
              {title}
            </span>
            <span className="text-muted">{description}</span>
          </div>
        </li>
      ))}
    </ListElement>
  );
}
