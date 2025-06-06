"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

type FilterType = "category" | "brand" | "price";

interface FilterProps {
  FilterName?: FilterType;
  FilterCategories?: string[];
}

const Filter: React.FC<FilterProps> = ({
  FilterName = "category",
  FilterCategories = [],
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Store selected filters for this filter type
  const [filtersApplied, setFiltersApplied] = useState<string[]>([]);

  // Sync filtersApplied state with URL query params on mount or when URL changes
  useEffect(() => {
    if (!searchParams) return;

    // get all values for this filter type from URL
    const selectedFilters = searchParams.getAll(FilterName);
    setFiltersApplied(selectedFilters);
  }, [searchParams, FilterName]);

  const onChangeHandler = (value: string) => {
    const current = new URLSearchParams(searchParams.toString());
    const values = new Set(current.getAll(FilterName));

    if (values.has(value)) {
      values.delete(value);
    } else {
      values.add(value);
    }

    current.delete(FilterName);
    values.forEach((v) => current.append(FilterName, v));

    // Update URL with new filters
    router.push(`?${current.toString()}`);
  };

  return (
    <details className="border-b py-2" open>
      <summary className="flex justify-between w-full text-lg font-semibold cursor-pointer">
        {FilterName.charAt(0).toUpperCase() + FilterName.slice(1)}
        <span>
          <ChevronDown size={20} />
        </span>
      </summary>
      <div className="mt-2 p-2 bg-gray-100 rounded-md">
        <p className="text-sm text-gray-600">
          {FilterCategories.map((category) => (
            <label key={category} className="flex items-center space-x-2">
              <input
                type="checkbox"
                value={category}
                checked={filtersApplied.includes(category)}
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
