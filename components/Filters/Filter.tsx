import React from "react";
import { ChevronDown } from "lucide-react";
type FilterType = "category" | "price" | "brand";

interface FilterProps {
  FilterName?: FilterType;
  FilterCategories?: string[];
  filtersApplied?: string[];
  handleCheckboxChange?: ((category: FilterType, value: string) => void) | null;
}
const Filter: React.FC<FilterProps> = ({
  FilterName = "category",
  FilterCategories = [],
  filtersApplied = [],
  handleCheckboxChange = null,
}) => {
  const onChangeHandler = (value: string) => {
    if (handleCheckboxChange) {
      handleCheckboxChange(FilterName, value);
    }
  };

  return (
    <details className="border-b py-2">
      <summary className="flex justify-between w-full text-lg font-semibold cursor-pointer">
        {FilterName.charAt(0).toUpperCase() + FilterName.slice(1)}
        <span className="icon">
          <ChevronDown size={20} className="details-icon" />
        </span>
      </summary>
      <div className="mt-2 p-2 bg-gray-100 rounded-md">
        <p className="text-sm text-gray-600">
          {FilterCategories.map((category: string) => (
            <label key={category} className="flex items-center space-x-2">
              <input
                type="checkbox"
                value={category}
                checked={filtersApplied?.includes(category)}
                onChange={() => onChangeHandler(category)}
              />
              <span>{category}</span>
            </label>
          ))}
        </p>
      </div>
    </details>
  );
};

export default Filter;
