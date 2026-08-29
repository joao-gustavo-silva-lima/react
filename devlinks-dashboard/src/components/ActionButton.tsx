export default function ActionButton({
  type,
  action,
  children,
  filled = false,
  additionalStyles = "",
}: {
  filled?: boolean;
  action?: () => void;
  children: React.ReactNode;
  additionalStyles?: string;
  type?: "button" | "submit" | "reset";
}) {
  return (
    <button
      className={`animated-button ${filled ? "bg-brand" : "main-border"} text-nowrap p-btn rounded-input ${additionalStyles}`}
      type={type ?? "button"}
      onClick={action}
    >
      {children}
    </button>
  );
}
