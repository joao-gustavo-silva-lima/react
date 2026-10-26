import { XIcon } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function ShareModal({
  username,
  closeModal,
}: {
  username: string;
  closeModal: () => void;
}) {
  const shareLink = `${document.location.origin}/u/${username}`;

  return (
    <div>
      <div>
        <h2>Compartilhar seu hub</h2>
        <button type="button" onClick={() => closeModal()}>
          <XIcon />
        </button>
      </div>
      <span>Escolha como você quer compartilhar seu link:</span>
      <div>
        <input type="text" disabled={true} value={shareLink} />
        <button
          type="button"
          onClick={async () => await navigator.clipboard.writeText(shareLink)}
        >
          Copiar
        </button>
      </div>
      <ul>
        <li>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://wa.me/?text=Conheça+o+meu+hub+em+Orbita:%0A%0A${encodeURI(shareLink)}`}
          >
            <img
              src="https://www.google.com/s2/favicons?domain=wa.me&sz=128"
              alt=""
            />
            <span>Whatsapp</span>
          </a>
        </li>
      </ul>
      <div>
        <span>QR Code</span>
        <span>Escaneie o código para acessar seu hub.</span>
        <QRCodeSVG
          value={shareLink}
          size={200}
          bgColor={"#ffffff"}
          fgColor={"#000000"}
          level={"L"}
        />
      </div>
    </div>
  );
}
