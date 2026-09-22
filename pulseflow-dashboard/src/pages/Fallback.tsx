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
      <a
        className="transition-all duration-[.125s] main-border border-primary font-medium text-primary px-[15px] py-[5px] rounded-md text-nowrap text-center bg-transparent  hover:bg-primary-foreground hover:border-primary-foreground active:bg-primary active:text-primary-foreground"
        href="/"
      >
        Voltar ao Dashboard
      </a>
    </main>
  );
}
