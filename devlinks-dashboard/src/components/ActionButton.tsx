export default function ActionButton({
  type,
  action,
  children,
  filled = false,
}: {
  filled?: boolean;
  action?: () => void;
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
}) {
  return (
    <button
      className={`animated-button ${filled ? "bg-brand" : "main-border"} text-nowrap p-btn rounded-input`}
      type={type ?? "button"}
      onClick={action}
    >
      {children}
    </button>
  );
}
