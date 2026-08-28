import { type Query } from "../types/links.types";
import { Search } from "lucide-react";
import CategorySelect from "./CategorySelect";

export default function SearchBar({
  filterQuery,
  setFilterQuery,
}: {
  filterQuery: Query;
  setFilterQuery: React.Dispatch<React.SetStateAction<Query>>;
}) {
  return (
    <search className="flex flex-wrap gap-[5px] text-body">
      <label
        className="flex flex-nowrap items-center p-search-bar gap-[5px] min-w-[200px] flex-1 rounded-input main-border"
        htmlFor="query_title"
      >
        <Search width={20} />
        <input
          className="w-full"
          type="text"
          name="title"
          onChange={(e) => {
            setFilterQuery({ ...filterQuery, title: e.target.value });
          }}
          id="query_title"
          placeholder="Pesquisar links..."
        />
      </label>
      <CategorySelect
        buttonStyles="text-nowrap gap-[5px] p-search-bar"
        itemsStyles="p-search-bar"
        placeholder="Todas as Categorias"
        category={filterQuery.category}
        changeCategory={(category) =>
          setFilterQuery({ ...filterQuery, category: category })
        }
      />
    </search>
  );
}
