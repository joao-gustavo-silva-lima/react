import { PREDEFINED_CATEGORIES, type Query } from "../types/links.types";
import { Search } from "lucide-react";

export default function SearchBar({
  filterQuery,
  setFilterQuery,
}: {
  filterQuery: Query;
  setFilterQuery: React.Dispatch<React.SetStateAction<Query>>;
}) {
  return (
    <search>
      <label htmlFor="query_title">
        <Search />
        <input
          type="text"
          name="title"
          onChange={(e) => {
            setFilterQuery({ ...filterQuery, title: e.target.value });
          }}
          id="query_title"
          placeholder="Pesquisar links..."
        />
      </label>
      <select
        onChange={(e) => {
          setFilterQuery({ ...filterQuery, category: e.target.value });
        }}
        name="category"
        id="query_category"
        value={filterQuery.category ?? ""}
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
