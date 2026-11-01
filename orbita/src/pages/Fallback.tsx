import { ArrowLeftIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function Fallback({
  code,
  headline,
  subHeadline,
}: {
  code: number;
  headline: string | React.ReactNode;
  subHeadline: string | React.ReactNode;
}) {
  return (
    <main className="contained flex flex-wrap items-center justify-center pt-[120px] gap-container">
      <div className="flex flex-col gap-element max-w-[400px]">
        <p className="brand-gradient-text text-[6em]/32 font-bold w-fit">
          {code}
        </p>
        <p className="text-3xl font-bold">{headline}</p>
        <p className="text-muted">{subHeadline}</p>
        <Link
          className="flex flex-nowrap items-center button-behaviour--filled mt-element gap-control"
          to="/"
        >
          <ArrowLeftIcon size={25} />
          Voltar para o início
        </Link>
      </div>
      <img
        className="w-full max-w-[600px]"
        src="/fallback-hero.png"
        alt="Imagem para a página de fallback."
      />
    </main>
  );
}
