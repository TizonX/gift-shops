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
import ErrorMessage from "@/components/ui/ErrorMessage";
import FullPageLoader from "./ui/FullPageLoader";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Home() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  const fetchProducts = async (pageNum = 1, replace = false) => {
    try {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(pageNum)); // append page param
      const res = await api(`/product/get-all-products?${params.toString()}`);
      const data = await res.json();
      setLoading(false);

      if (replace) {
        setProducts(data.products);
      } else {
        setProducts((prev) => [...prev, ...data.products]);
      }
      // If fewer than 10 products returned, assume no more
      setHasMore(data.products.length >= 10);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };
  useEffect(() => {
    // Reset page & products if searchParams change
    setLoading(true);
    setProducts([]);
    setPage(1);
    fetchProducts(1, true);
  }, [searchParams]);

  const loadMore = () => {
    const nextPage = page + 1;
    fetchProducts(nextPage);
    setPage(nextPage);
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
              <Filter FilterName="category" FilterCategories={CATEGORIES} />
              <Filter FilterName="price" FilterCategories={PRICE_RANGES} />
              <Filter FilterName="brand" FilterCategories={BRANDS} />
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-12 md:col-span-12 lg:col-span-9">
        {loading && <FullPageLoader />}
        {error && <ErrorMessage message={error} />}
        <InfiniteScroll
          dataLength={products.length}
          next={loadMore}
          hasMore={hasMore}
          loader={<p className="text-center text-2xl text-bold">Loading...</p>}
          scrollThreshold={0.9}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            {products.map((_: Product, index: number) => (
              <ProductCard product={_} key={index} />
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
}
