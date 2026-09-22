import { CATEGORIES_TO_PT_BR, type Query } from "../types/routines.types";
import { Search } from "lucide-react";

export default function SearchBar({
  query,
  setQuery,
}: {
  query: Query;
  setQuery: React.Dispatch<React.SetStateAction<Query>>;
}) {
  const onTitleChange = (targetValue: Query["title"]) => {
    setQuery(({ category }) => ({
      title: targetValue.trim().toLowerCase(),
      category,
    }));
  };

  const onCategoryChange = (targetValue: Query["category"]) => {
    setQuery(({ title }) => ({
      title,
      category: targetValue,
    }));
  };

  return (
    <search className="flex flex-col gap-gap-md">
      <label
        className="flex flex-row flex-nowrap gap-gap-md bg-surface px-[.75em] py-[.5em] rounded-sm main-border"
        htmlFor="searchbar"
      >
        <Search width={20} />
        <input
          max={50}
          type="text"
          id="searchbar"
          className="w-full"
          value={query.title}
          placeholder="Buscar Hábitos ou Tarefas..."
          onChange={(e) => onTitleChange(e.target.value)}
        />
      </label>
      <ul className="flex flex-wrap gap-gap-md">
        {(
          [
            ["All", "Todos"],
            ["Complete", "✅ Concluídos"],
            ["Pending", "⏳ Pendentes"],
            ...CATEGORIES_TO_PT_BR.entries(),
          ] as [Query["category"], string][]
        ).map(([value, category]) => (
          <li className="flex-1" key={`query-category-${value}-button`}>
            <button
              className={`transition-all duration-[.25s] w-full text-sm text-nowrap px-[.5em] py-[.5em] main-border hover:cursor-pointer rounded-sm hover:scale-[105%] active:scale-[95%] ${query.category === value ? "text-primary border-primary bg-primary-foreground" : "bg-surface"}`}
              onClick={() =>
                onCategoryChange(query.category !== value ? value : "All")
              }
            >
              {category}
            </button>
          </li>
        ))}
      </ul>
    </search>
  );
}
