export default function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed top-0 left-0 w-full min-h-dvh z-10 bg-black/50 [&>*]:z-20 flex justify-center items-center">
      {children}
    </div>
  );
}
