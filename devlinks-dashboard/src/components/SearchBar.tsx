import { Search } from "lucide-react";
import { PREDEFINED_CATEGORIES, type Query } from "../types/links.types";
import { useRef } from "react";

export default function SearchBar({
  refetchLinks,
}: {
  refetchLinks: (query: Query) => void;
}) {
  const titleRef = useRef("");
  const categoryRef = useRef("");
  const queryCooldownRef = useRef(-1);

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    clearTimeout(queryCooldownRef.current);
    queryCooldownRef.current = setTimeout(() => {
      titleRef.current = e.target.value;

      query();
    }, 500);
  }

  function query() {
    refetchLinks({
      title: titleRef.current,
      category: categoryRef.current,
    });
  }

  return (
    <search>
      <label htmlFor="query_title">
        <Search />
        <input
          type="text"
          name="title"
          onChange={handleTitleChange}
          id="query_title"
          placeholder="Pesquisar links..."
        />
      </label>
      <select
        onChange={(e) => {
          categoryRef.current = e.target.value;

          query();
        }}
        name="category"
        id="query_category"
        defaultValue={categoryRef.current}
      >
        <option value="">Todas as Categorias</option>
        {PREDEFINED_CATEGORIES.map((category, i) => (
          <option key={i} value={category.toLowerCase()}>
            {category}
          </option>
        ))}
      </select>
    </search>
  );
}
