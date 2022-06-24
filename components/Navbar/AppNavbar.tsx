import { SidebarDropdown } from "@components/Dropdown/SidebarDropdown";
import { UserDropdown } from "@components/Dropdown/UserDropdown";
import { Logo } from "@components/UI/Logo";
import { SearchIcon as HISearchIcon } from "@heroicons/react/outline";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { NotificationsDropdown } from "@components/Dropdown/NotificationsDropdown";
import { useRouter } from "next/router";
import { classes } from "libs/classes";
import { LocaleDropdown } from "@components/Dropdown/LocaleDropdown";
import { useTranslations } from "next-intl";

export const Navbar: React.FC<any> = () => {
  const router = useRouter();
  const [query, setQuery] = useState(router.query.q || "");

  return (
    <div
      className={classes(
        "inline-flex items-center fixed top-0 justify-between w-full md:w-[calc(100vw-4rem)] z-40 h-16 px-4 xl:px-12 m-0 bg-white dark:bg-black xl:w-[calc(100vw-10rem)]"
      )}
    >
      <div className="flex pr-4 md:hidden">
        <Logo />
      </div>
      <div className="inline-flex items-center w-full space-x-4">
        <LocaleDropdown />
        <Search query={query} setQuery={setQuery} />
      </div>
      <div className="inline-flex items-center justify-end pl-6 space-x-4 shrink-0 ">
        {/* <ThemeIcon /> */}
        <NotificationsDropdown key={uuidv4()} />
        <SidebarDropdown key={uuidv4()} />
        <UserDropdown key={uuidv4()} />
      </div>
    </div>
  );
};

const Search = ({ query, setQuery }) => {
  const router = useRouter();

  const post = (e) => {
    e.preventDefault();
    router.push({
      pathname: "/resource",
      query: { q: query },
    });
  };

  const t = useTranslations("Navbar");

  return (
    <form className="w-full" onSubmit={(e) => post(e)}>
      <label className="relative w-full text-gray-400 focus-within:text-gray-600 md:w-3/5">
        <HISearchIcon className="absolute w-4 h-4 duration-300 transform -translate-y-1/2 pointer-events-none top-1/2 left-3" />
        <input
          id="search"
          name="search"
          type="text"
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          required
          className="input px-5 py-2 h-9 pl-[2.25rem] placeholder-gray-500 w-full text-ellipsis"
          placeholder={t("search-placeholder")}
        />
      </label>
    </form>
  );
};
