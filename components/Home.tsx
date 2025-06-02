"use client";
import { api } from "../app/lib/api";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Product } from "@/util/types/products";
import ProductCard from "@/components/ProductCard";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CATEGORIES, BRANDS, PRICE_RANGES } from "../constants/filtersData";
import Filter from "./Filters/Filter";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import ErrorMessage from "@/components/ui/ErrorMessage";

export default function Home() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api(`/product/get-all-products?${params.toString()}`);
        const data = await res.json();
        setProducts(data.products);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]); // refetch every time URL filters change

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
              <Filter FilterName="category" FilterCategories={CATEGORIES} />
              <Filter FilterName="price" FilterCategories={PRICE_RANGES} />
              <Filter FilterName="brand" FilterCategories={BRANDS} />
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-12 md:col-span-12 lg:col-span-9">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          {products?.map((_: Product, index: number) => (
            <ProductCard product={_} key={index} />
          ))}

          {loading && <LoadingSkeleton />}
          {error && <ErrorMessage message={error} />}
        </div>
      </div>
    </div>
  );
}
