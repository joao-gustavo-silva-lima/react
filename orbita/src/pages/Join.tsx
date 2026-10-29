export default function Join({ modal }: { modal: React.ReactNode }) {
  //This page should redirect to  /u/username when user is logged in

  return (
    <main>
      <div>
        <p>Conecte seu mundo em um só lugar.</p>
        <p>
          Links, contatos e redes sociais. Tudo no seu perfil hub, de forma
          rápida, simples e personalizada.
        </p>
        <img src="../../public/hero.ignore.png" alt="" />
      </div>
      {modal}
    </main>
  );
}
