"use client";
import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { products } from "../util/product";
import {
  CATEGORIES,
  BRANDS,
  PRICE_RANGES,
} from "../constants/filtersData";
import Filter from "../components/Filters/Filter";

export default function Home() {
  // Types
  type FilterType = "category" | "price" | "brand";
  type FiltersState = {
    category: string[];
    price: string[];
    brand: string[];
  };
  type Product = {
    name: string;
    description: string;
    price: number | string;
    image: string;
  };
  const [filters, setFilters] = useState<FiltersState>({
    category: [],
    price: [],
    brand: [],
  });

  const handleCheckboxChange = (filterType: FilterType, value: string): void => {
    setFilters((prev) => {
      const isAlreadySelected = prev[filterType].includes(value);
      const updatedFilter = isAlreadySelected
        ? prev[filterType].filter((item) => item !== value)
        : [...prev[filterType], value];

      return {
        ...prev,
        [filterType]: updatedFilter,
      };
    });
  };

  const matchPriceRange = (price: number, range: string) => {
    if (range === "under 1000") return price < 1000;
    if (range === "1000 - 5000") return price >= 1000 && price <= 5000;
    if (range === "5000 10000") return price > 5000 && price <= 10000;
    if (range === "above 10000") return price > 10000;
    return false;
  };

  const getFilteredProducts = () => {
    return products.filter((product) => {
      const matchesCategory =
        filters.category.length === 0 ||
        filters.category.includes(product.category);
      const matchesBrand =
        filters.brand.length === 0 || filters.brand.includes(product.brand);
      const matchesPrice =
        filters.price.length === 0 ||
        filters.price.some((range) => matchPriceRange(product.price, range));

      return matchesCategory && matchesBrand && matchesPrice;
    });
  };

  return (
    <div className="grid grid-cols-12 gap-1 h-screen mt-16">
      <div className="col-span-3 hidden lg:block w-64 h-screen">
        <div className="w-[300px] fixed top-14 h-screen bg-gray-100 ">
          <div className="h-full overflow-y-scroll no-scrollbar  pb-20 ">
            <h3 className="p-4 text-2xl font-bold">Filter</h3>
            <div className="mx-auto p-4 relative">
              <input
                type="text"
                placeholder="Search"
                className="w-full p-4 pl-10 border rounded-md outline outline-1"
              />
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="absolute top-1/2 left-8 transform -translate-y-1/2 text-gray-500 font-extralight"
              />
            </div>
            <div>
              <Filter
                FilterName="category"
                FilterCategories={CATEGORIES}
                filtersApplied={filters.category}
                handleCheckboxChange={handleCheckboxChange}
              />
              <Filter
                FilterName="price"
                FilterCategories={PRICE_RANGES}
                filtersApplied={filters.price}
                handleCheckboxChange={handleCheckboxChange}
              />
              <Filter
                FilterName="brand"
                FilterCategories={BRANDS}
                filtersApplied={filters.brand}
                handleCheckboxChange={handleCheckboxChange}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-12 md:col-span-12 lg:col-span-9">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          {getFilteredProducts().map((_: Product, index: number) => (
            <ProductCard product={_} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
