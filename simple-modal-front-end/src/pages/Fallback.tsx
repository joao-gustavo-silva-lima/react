import { Link } from "react-router-dom";

export default function Fallback({ message }: { message: string }) {
  return (
    <div className="contained flex flex-col justify-center items-center px-[25px] py-[15px]">
      <img
        className="w-full max-w-[150px]"
        src="/images/fallback-hero.png"
        alt="Imagem de uma lupa investigando engrenagens. Imagem para a página de fallback."
      />
      <p>{message}</p>
      <Link
        to="/"
        className="button-basics mt-[20px] w-fit rounded-md bg-brand-primary px-[16px] py-[8px] text-sm font-semibold text-text-on-brand hover:bg-brand-hover active:bg-brand-active"
      >
        VOLTAR À PÁGINA INICIAL
      </Link>
    </div>
  );
}
