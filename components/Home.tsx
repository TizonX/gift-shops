"use client";
import { api } from "../app/lib/api";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Product } from "@/util/types/products";
import ProductCard from "@/components/ProductCard";
import { CATEGORIES, BRANDS, PRICE_RANGES } from "../constants/filtersData";
import Filter from "./Filters/Filter";
import ErrorMessage from "@/components/ui/ErrorMessage";
import FullPageLoader from "./ui/FullPageLoader";
import InfiniteScroll from "react-infinite-scroll-component";
import { useProfile } from "@/app/context/ProfileContext";
import SearchBox from "./SearchBox";

export default function Home() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const { loading: profileLoading } = useProfile();

  const fetchProducts = useCallback(async (pageNum = 1, replace = false) => {
    try {
      const params = new URLSearchParams();
      params.set("page", String(pageNum));
      params.set("limit", "10");

      // Handle multiple filter values
      const searchParamsObj = new URLSearchParams(searchParams.toString());
      const filterTypes = ["category", "price", "brand"];

      filterTypes.forEach((filterType) => {
        const values = searchParamsObj.getAll(filterType);
        if (values.length > 0) {
          params.set(filterType, values.join(","));
        }
      });

      // Add search query if exists
      const query = searchParamsObj.get("query");
      if (query) {
        params.set("query", query);
      }

      const res = await api(`/category/products?${params.toString()}`, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

      const responseData = await res.json();
      setLoading(false);

      // Check if the response has the expected structure
      if (
        !responseData?.data?.products ||
        !Array.isArray(responseData.data.products)
      ) {
        throw new Error("Invalid response format");
      }

      const productsData = responseData.data.products;

      if (replace) {
        setProducts(productsData);
      } else {
        setProducts((prev) => [...prev, ...productsData]);
      }

      setHasMore(productsData.length >= 10);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load products");
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    setProducts([]);
    setPage(1);
    setError(null);
    fetchProducts(1, true);
  }, [searchParams, fetchProducts]);

  const loadMore = () => {
    if (!loading && !error) {
      const nextPage = page + 1;
      fetchProducts(nextPage);
      setPage(nextPage);
    }
  };

  if (profileLoading) {
    return <FullPageLoader />;
  }

  return (
    <div className="grid grid-cols-12 gap-1 h-screen mt-16">
      <div className="col-span-3 hidden lg:block w-64 h-screen">
        <div className="w-[300px] fixed top-14 h-screen bg-gray-100 ">
          <div className="h-full overflow-y-scroll no-scrollbar pb-20">
            <h3 className="p-4 text-2xl font-bold">Filter</h3>
            <div className="mx-auto p-4 relative">
              <SearchBox />
            </div>
            <div>
              <Filter FilterName="category" FilterCategories={CATEGORIES} />
              <Filter FilterName="price" FilterCategories={PRICE_RANGES} />
              <Filter FilterName="brand" FilterCategories={BRANDS} />
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-12 md:col-span-12 lg:col-span-9 p-4">
        {loading && <FullPageLoader />}
        {error && <ErrorMessage message={error} />}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No products found</p>
          </div>
        )}
        {products.length > 0 && (
          <InfiniteScroll
            dataLength={products.length}
            next={loadMore}
            hasMore={hasMore}
            loader={
              <p className="text-center text-2xl text-bold">Loading...</p>
            }
            scrollThreshold={0.9}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
              {products.map((product: Product) => (
                <ProductCard product={product} key={product._id} />
              ))}
            </div>
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
}
