import { CATEGORIES_TO_PT_BR, type Query } from "../types/routines.types";

export default function SearchBar({
  setQuery,
}: {
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
    <search>
      <label htmlFor="searchbar">
        🔎
        <input
          onChange={(e) => onTitleChange(e.target.value)}
          type="text"
          id="searchbar"
        />
      </label>
      <ul>
        {(
          [
            ["All", "Todos"],
            ["Complete", "Concluídos"],
            ["Pending", "Pendentes"],
            ...CATEGORIES_TO_PT_BR.entries(),
          ] as [Query["category"], string][]
        ).map(([value, category]) => (
          <li key={`query-category-${value}-button`}>
            <button onClick={() => onCategoryChange(value)}>{category}</button>
          </li>
        ))}
      </ul>
    </search>
  );
}
