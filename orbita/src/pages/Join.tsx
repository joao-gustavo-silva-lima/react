import { useEffect } from "react";
import { useFetchUserProfile } from "../hooks/useUser";
import { useNavigate } from "react-router-dom";

export default function Join({ modal }: { modal: React.ReactNode }) {
  const navigate = useNavigate();

  const { data: authenticatedUser, isSuccess } = useFetchUserProfile();

  useEffect(() => {
    if (isSuccess && authenticatedUser !== null) {
      navigate(`/u/${authenticatedUser.username}`);
    }
  }, [authenticatedUser]);

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
