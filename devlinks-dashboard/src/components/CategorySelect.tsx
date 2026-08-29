import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { PREDEFINED_CATEGORIES } from "../types/links.types";

export default function CategorySelect({
  category: categoryState,
  validateInput,
  changeCategory,
  placeholder,
  error = false,
  itemsStyles = "",
  buttonStyles = "",
  dropdownStyles = "",
}: {
  error?: boolean;
  category?: string;
  placeholder?: string;
  itemsStyles?: string;
  buttonStyles?: string;
  dropdownStyles?: string;
  validateInput?: () => void;
  changeCategory: (category: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex-1">
      <button
        type="button"
        onBlur={() => {
          setIsOpen(false);
          validateInput && validateInput();
        }}
        onFocus={() => setIsOpen(true)}
        className={`${buttonStyles} flex flex-row flex-nowrap justify-between items-center w-full capitalize main-border ${error ? "border-error" : ""} focus:border-white rounded-input p-input hover:cursor-pointer`}
      >
        <span>{categoryState || placeholder || "Categoria"}</span>
        <ChevronDown width={17.5} />
      </button>

      <ul
        className={`absolute top-0 left-0 ${isOpen ? "flex" : "hidden"} flex-col flex-nowrap w-full h-[150px] bg-surface capitalize rounded-input main-border border-[white] overflow-auto ${dropdownStyles}`}
      >
        {["", ...PREDEFINED_CATEGORIES].map((category, i) => (
          <li
            className={`!${itemsStyles} text-nowrap p-input ${category === categoryState ? "bg-border-main" : ""} hover:cursor-pointer hover:bg-border-main`}
            onMouseDown={() => changeCategory(category.toLowerCase())}
            key={i}
          >
            {category || placeholder || "categoria"}
          </li>
        ))}
      </ul>
    </div>
  );
}
