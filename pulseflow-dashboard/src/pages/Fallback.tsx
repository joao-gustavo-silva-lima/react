import ActionButton from "../components/ActionButton";

export default function Fallback({ message }: { message?: string }) {
  return (
    <main className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-col justify-center items-center gap-gap-lg">
      <img
        className="w-[75px]"
        src="/public/images/fallback-hero.png"
        alt="Imagem de um bloco de notas. Imagem hero para a página de fallback."
      />
      <p className="text-text-secondary text-base text-center">
        {message ?? "Oops... Não queremos ficar por aqui."}
      </p>
      <ActionButton to="/">Voltar ao Dashboard</ActionButton>
    </main>
  );
}
