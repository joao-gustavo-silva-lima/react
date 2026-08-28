import { CodeXml, Search } from "lucide-react";

export default function Header() {
  return (
    <header className="flex justify-center w-full bg-surface main-border">
      <div className="contained p-container flex flex-row flex-nowrap justify-between  items-center">
        <a className="flex flex-nowrap items-center gap-[5px]" href="/">
          <div className="w-fit aspect-square p-[5px] rounded-[5px] bg-brand">
            <CodeXml width={20} />
          </div>
          <span className="text-h2 font-[500]">DevLinks</span>
        </a>
        <label
          onClick={scrollToSearchBar}
          className="hover:cursor-pointer p-[5px]"
          htmlFor="query_title"
        >
          <Search width={20} />
        </label>
      </div>
    </header>
  );
}

function scrollToSearchBar() {
  const searchBarElement = document.getElementById("query_title");

  if (!searchBarElement) {
    return;
  }

  searchBarElement.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}
