import { PREDEFINED_CATEGORIES, type Query } from "../types/links.types";
import { Search } from "lucide-react";
import { useRef } from "react";

export default function SearchBar({
  refetchLinks,
}: {
  refetchLinks: (query: Query) => void;
}) {
  const titleRef = useRef("");
  const categoryRef = useRef("");
  const searchDebounceRef = useRef(-1);

  function handleSearchDebounce() {
    clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      refetchLinks({
        title: titleRef.current,
        category: categoryRef.current,
      });
    }, 500);
  }

  return (
    <search>
      <label htmlFor="query_title">
        <Search />
        <input
          type="text"
          name="title"
          onChange={(e) => {
            titleRef.current = e.target.value;
            handleSearchDebounce();
          }}
          id="query_title"
          placeholder="Pesquisar links..."
        />
      </label>
      <select
        onChange={(e) => {
          categoryRef.current = e.target.value;
          handleSearchDebounce();
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
