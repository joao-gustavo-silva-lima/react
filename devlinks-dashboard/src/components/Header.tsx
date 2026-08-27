import { CodeXml, Search } from "lucide-react";

export default function Header() {
  return (
    <header className="flex justify-center w-full bg-surface main-border">
      <div className="container flex flex-row flex-nowrap justify-between  items-center">
        <a className="flex flex-nowrap items-center gap-[5px]" href="/">
          <div className="w-fit aspect-square p-[5px] rounded-[5px] bg-brand">
            <CodeXml width={20} />
          </div>
          <span className="text-h2 font-[500]">DevLinks</span>
        </a>
        <label className="hover:cursor-pointer p-[5px]" htmlFor="query_title">
          <Search width={20} />
        </label>
      </div>
    </header>
  );
}
