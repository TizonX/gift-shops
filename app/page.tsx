import { faMagnifyingGlass, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChevronDown, ChevronUp } from "lucide-react";
export default function Home() {
  const filtersList = ["category", "price", "brand"];

  return (
    <div className="grid grid-cols-12 gap-1 h-screen mt-16">
      <div className="col-span-3 hidden md:block w-64  h-screen">
        <div className="w-[300px] fixed top-14 h-screen bg-gray-100 ">
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
            {filtersList.map((filter) => (
              <details key={filter} className="border-b py-2">
                <summary className="flex justify-between w-full text-lg font-semibold cursor-pointer">
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  <span className="icon">
                    <ChevronDown size={20} className="details-icon" />
                  </span>
                </summary>
                <div className="mt-2 p-2 bg-gray-100 rounded-md">
                  <p className="text-sm text-gray-600">
                    Filter options for {filter}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
      <div className="col-span-9">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          {Array.from({ length: 20 }).map((_, index) => (
            <div key={index} className="bg-white p-4 shadow rounded-lg h-48">
              <p>Product {index + 1}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
