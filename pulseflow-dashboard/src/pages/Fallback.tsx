export default function Fallback({ message }: { message?: string }) {
  return (
    <main>
      <img
        src="/public/images/fallback-hero.png"
        alt="Imagem de uma caixa despejando papeis. Imagem hero para a página de fallback."
      />
      <p>{message ?? "Oops... Não queremos ficar por aqui."}</p>
      <a href="/">Voltar ao Dashboard</a>
    </main>
  );
}
