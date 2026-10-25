import { cloneElement, useState } from "react";
import { Link } from "react-router-dom";

export default function Modal({ mode }: { mode: "registro" | "login" }) {
  const isRegisterMode = mode === "registro";
  const [isViewPrivate, setIsViewPrivate] = useState(true);

  return (
    <form>
      <h3>{"\u{1F300}"} Orbita</h3>
      <h2>{isRegisterMode ? "Crie seu hub!" : "Bem-vindo de volta!"}</h2>
      <span>
        {isRegisterMode
          ? "É rápido e gratuito."
          : "Entre na sua conta para continuar."}
      </span>
      <fieldset>
        {isRegisterMode && (
          <>
            <Input label="Nome Completo" error={"erro"}>
              <input type="text" id="name" />
            </Input>
            <Input label="Email" error={"erro"}>
              <input type="text" id="email" />
            </Input>
          </>
        )}
        <Input label="Usuário" error={"erro"}>
          <input type="text" id="username" />
        </Input>
        <Input label="Senha" error={"erro"}>
          <div>
            <input type={isViewPrivate ? "password" : "text"} id="password" />
            <button
              type="button"
              onClick={() => setIsViewPrivate(!isViewPrivate)}
            >
              {"\u{1F441}"}
            </button>
          </div>
        </Input>
        <button type="submit">
          {isRegisterMode ? "Criar Conta" : "Entrar"}
        </button>
      </fieldset>
      {isRegisterMode ? (
        <span>
          Já tem uma conta? <Link to="/login">Entrar</Link>
        </span>
      ) : (
        <span>
          Não tem uma conta? <Link to="/registro">Criar conta</Link>
        </span>
      )}
    </form>
  );
}

function Input({
  label,
  error,
  children,
}: {
  label: string;
  error: string | undefined;
  children: React.ReactElement<React.InputHTMLAttributes<HTMLInputElement>>;
}) {
  return (
    <label htmlFor={children.props.id}>
      <span>{label}</span>
      {cloneElement(children, {
        className: children.props.className ?? "",
      })}
      {error && <p>{error}</p>}
    </label>
  );
}
