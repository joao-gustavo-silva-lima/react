import { useEffect } from "react";

export default function Overlay({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.body.classList.add("no-scroll");

    return () => document.body.classList.remove("no-scroll");
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full min-h-dvh z-10 bg-black/50 [&>*]:z-20 flex justify-center items-center">
      {children}
    </div>
  );
}
