// import { Chip } from "@components/ui/Chip";
import {
  SearchIcon,
  ChevronDownIcon,
  LibraryIcon,
} from "@heroicons/react/outline";
import { types } from "constants/resourcesTypes";
import { useRouter } from "next/router";
import { useState } from "react";

export const SearchSection = () => {
  const [query, setQuery] = useState("");
  const [type, setType] = useState(null);
  const router = useRouter();

  const post = (e) => {
    e.preventDefault();
    router.push({
      pathname: "/resource",
      query: { q: query, ...(type ? { type } : null) },
    });
  };

  return (
    <div className="flex-col hidden w-full px-32 my-4 mb-12 space-y-4 lg:flex lg:my-12">
      <h4 className="mb-1 text-xl font-bold tracking-tight text-center font-marianne sm:text-2xl">
        Que recherchez-vous ?
      </h4>
      <form className="relative w-full" onSubmit={(e) => post(e)}>
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full mx-12 border-t border-gray-300 dark:border-gray-700" />
        </div>
        <div className="relative flex flex-col justify-center space-y-1 text-sm lg:space-x-3 lg:space-y-0 lg:flex-row">
          <label className="relative text-gray-400 focus-within:text-gray-600">
            <LibraryIcon className="absolute w-4 h-4 transform -translate-y-1/2 pointer-events-none top-1/2 left-3" />
            <input
              id="search"
              name="search"
              type="text"
              autoComplete="off"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
              className="input px-5 py-2 pl-[2.25rem] placeholder-gray-500   lg:w-96 "
              placeholder="Rechercher ..."
            />
          </label>
          <label className="relative text-gray-400 focus-within:text-gray-600">
            {type === null ? (
              <SearchIcon className="absolute w-4 h-4 transform -translate-y-1/2 pointer-events-none top-1/2 left-3" />
            ) : (
              types
                .find((t) => t.value === type)
                ?.icon.outline({
                  className:
                    "absolute w-4 h-4 transform -translate-y-1/2 pointer-events-none top-1/2 left-3",
                })
            )}
            <select
              value={type || ""}
              onChange={(e) => {
                if (e.target.value === "null") setType(null);
                else setType(e.target.value);
              }}
              required
              name="searchType"
              className="input px-5 py-2 appearance-none pl-[2.25rem] placeholder-gray-500   lg:w-48 "
              placeholder="Type de la ressource"
            >
              <option value="null">Tout type</option>
              {types.map((type, idx) => (
                <option key={idx} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute w-4 h-4 transform -translate-y-1/2 pointer-events-none top-1/2 right-3" />
          </label>
          <button className="btn-blue">
            <SearchIcon className="w-4 h-4 mr-2" />
            Rechercher
          </button>
        </div>
      </form>
      {/* <div className="hidden pt-3 mx-auto space-x-3 overflow-x-hidden lg:inline-flex md:pt-0 md:pl-3">
        <Chip size="normal" color="green" name="Tomorrow" />
        <Chip size="normal" color="amber" name="This week" />
        <Chip size="normal" color="purple" name="Near you" />
        <Chip size="normal" color="blue" name="Online" />
        <Chip size="normal" color="red" name="In person" />
      </div> */}
    </div>
  );
};
