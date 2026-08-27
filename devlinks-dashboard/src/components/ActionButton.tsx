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
      className={`animated-button ${filled ? "bg-brand" : "main-border"} p-btn rounded-input`}
      type={type}
      onClick={action}
    >
      {children}
    </button>
  );
}
