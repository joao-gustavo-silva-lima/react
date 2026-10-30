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
    <div className="flex flex-col w-full bp-sm:w-fit min-h-dvh bp-sm:min-h-fit rounded-none bg-surface p-container rounded-modal gap-element">
      <div className="flex items-center flex-nowrap justify-between">
        <h2 className="text-xl font-bold">Compartilhar seu hub</h2>
        <button
          className="button-behaviour"
          type="button"
          onClick={() => closeModal()}
        >
          <XIcon />
        </button>
      </div>
      <span className="text-muted">
        Escolha como você quer compartilhar seu link:
      </span>
      <div className="flex flex-nowrap gap-element">
        <input
          className="flex-1 border-1 border-border rounded-control p-control truncate min-w-0"
          type="text"
          disabled={true}
          value={shareLink}
        />
        <button
          className="button-behaviour px-container border-1 hover:border-primary hover:bg-elevated rounded-control"
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(shareLink);
            alert("Endereço URL do hub copiado para a área de transferência.");
          }}
        >
          Copiar
        </button>
      </div>
      <div className="flex flex-col border-1 border-border p-container rounded-control">
        <span className="text-xl font-bold">QR Code</span>
        <span className="text-muted mb-container">
          Escaneie o código para acessar seu hub.
        </span>
        <QRCodeSVG
          className="self-center rounded-control"
          value={shareLink}
          size={125}
          marginSize={2}
          bgColor={"#ffffff"}
          fgColor={"#635bff"}
          level={"L"}
        />
      </div>
    </div>
  );
}
