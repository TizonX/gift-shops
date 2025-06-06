import { useState, useEffect, useRef } from "react";
import { api } from "@/app/lib/api";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

interface SearchSuggestion {
  _id: string;
  title: string;
  type: string;
}

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Close suggestions when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const res = await api(
          `/category/products/search?query=${encodeURIComponent(
            query
          )}&limit=5`,
          {
            credentials: "include",
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch suggestions");
        }

        const data = await res.json();

        // Keep suggestions and similar results separate
        const allResults = {
          suggestions: data?.data?.suggestions || [],
          similar: data?.data?.similar || [],
        };

        setSuggestions([...allResults.suggestions, ...allResults.similar]);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSearch = (searchQuery: string) => {
    // Clear all filters and set only the search query
    const params = new URLSearchParams();
    if (searchQuery) {
      params.set("query", searchQuery);
    }
    router.push(`/?${params.toString()}`);
    setShowSuggestions(false);
    setQuery(searchQuery);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(query);
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search products..."
          className="w-full p-4 pl-10 border rounded-md outline outline-1"
        />
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500 font-extralight"
        />
      </div>

      {/* Suggestions Tray */}
      {showSuggestions && query.length >= 2 && (
        <div className="absolute w-full mt-1 bg-white border rounded-md shadow-lg z-50 max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : suggestions.length > 0 ? (
            <div>
              {/* Direct Suggestions */}
              {suggestions.filter((s) => s.type === "suggestion").length >
                0 && (
                <>
                  <div className="px-4 py-2 bg-gray-50 border-b">
                    <span className="text-sm font-medium text-gray-700">
                      Suggestions
                    </span>
                  </div>
                  <ul className="divide-y divide-gray-100">
                    {suggestions
                      .filter((s) => s.type === "suggestion")
                      .map((suggestion) => (
                        <li
                          key={suggestion._id}
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleSearch(suggestion.title)}
                        >
                          <span className="font-medium">
                            {suggestion.title}
                          </span>
                        </li>
                      ))}
                  </ul>
                </>
              )}

              {/* Similar Results */}
              {suggestions.filter((s) => s.type === "similar").length > 0 && (
                <>
                  <div className="px-4 py-2 bg-gray-50 border-b">
                    <span className="text-sm font-medium text-gray-700">
                      Similar Products
                    </span>
                  </div>
                  <ul className="divide-y divide-gray-100">
                    {suggestions
                      .filter((s) => s.type === "similar")
                      .map((suggestion) => (
                        <li
                          key={suggestion._id}
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleSearch(suggestion.title)}
                        >
                          <span className="font-medium">
                            {suggestion.title}
                          </span>
                        </li>
                      ))}
                  </ul>
                </>
              )}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No products found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
