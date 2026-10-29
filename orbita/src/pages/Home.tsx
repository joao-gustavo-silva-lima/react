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
      <main>
        <div>
          <p>Todos os seus links e contatos em um só lugar.</p>
          <p>
            Orbita é o seu profile hubing. Reúna seus links, redes sociais,
            contatos e muito mais em um hub simples e rápido.
          </p>
          <div>
            <Link to="/cadastro">Comece agora — é grátis</Link>
            <Link to="/#funcionamento">Ver como funciona</Link>
          </div>
        </div>
        <img
          src="../../public/hero.ignore.png"
          alt="Imagem principal da página principal."
        />
      </main>
      <section id="recursos">
        <h2>Por que Orbita?</h2>
        <CardList
          keyPrefix="section--resources"
          list={[
            [ZapIcon, "Rápido", "Crie seu hub em minutos."],
            [LeafIcon, "Simple", "Sem complicação, sem mistério."],
            [ForwardIcon, "Compartilhar", "Seu perfil onde quiser."],
          ]}
        />
      </section>
      <section id="funcionamento">
        <h2>Com funciona?</h2>
        <p>Em poucos passos, você já tem seu hub no ar.</p>
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
  const ListElement = ({ children }: { children: React.ReactNode }) =>
    ordered ? <ol>{children}</ol> : <ul>{children}</ul>;

  return (
    <ListElement>
      {list.map(([Icon, title, description], index) => (
        <li key={`${keyPrefix}--${index}`}>
          <div>
            <Icon />
          </div>
          <div>
            <span>
              {ordered && `${index + 1}. `}
              {title}
            </span>
            <span>{description}</span>
          </div>
        </li>
      ))}
    </ListElement>
  );
}
