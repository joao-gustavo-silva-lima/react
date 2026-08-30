export default function Overlay({
  children,
  style = "",
}: {
  children: React.ReactNode;
  style?: string;
}) {
  return (
    <div
      className={`${style} fixed flex justify-center items-center top-0 w-full h-dvh bg-overlay z-2`}
    >
      {children}
    </div>
  );
}
