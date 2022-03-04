import { SidebarDropdown } from "@components/dropdowns/SidebarDropdown";
import { UserDropdown } from "@components/dropdowns/UserDropdown";
import { Logo } from "@components/ui/Logo";
import { SearchIcon as HISearchIcon } from "@heroicons/react/outline";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { motion } from "framer-motion";
import { NotificationsDropdown } from "@components/dropdowns/NotificationsDropdown";
import { useRouter } from "next/router";
import { classes } from "@utils/classes";

export const Navbar: React.FC<any> = () => {
  const router = useRouter();
  const [query, setQuery] = useState(router.query.q || "");

  return (
    <div
      className={classes(
        "inline-flex items-center fixed top-0 justify-between w-full md:w-[calc(100vw-4rem)] z-40 h-16 px-12 m-0 bg-white dark:bg-black"
      )}
    >
      <Logo />
      <Search query={query} setQuery={setQuery} />
      <div className="inline-flex items-center justify-end pl-6 space-x-4 lg:w-56 shrink-0 lg:pl-0 ">
        {/* <ThemeIcon /> */}
        <NotificationsDropdown key={uuidv4()} />
        <SidebarDropdown key={uuidv4()} />
        <UserDropdown key={uuidv4()} />
      </div>
    </div>
  );
};

const Search = ({ query, setQuery }) => {
  const [iconIdx, setIconIdx] = useState(0);
  const router = useRouter();

  const post = (e) => {
    e.preventDefault();
    router.push({
      pathname: "/resource",
      query: { q: query },
    });
  };

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
          // placeholder="Rechercher une ressource, un canal, un utilisateur..."
          placeholder="Rechercher une ressource..."
        />
      </label>
    </form>
  );
};

const SearchIcon = ({ className, setIconIdx }) => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <motion.path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      // onAnimationEnd={() => setIconIdx(1)}
      onAnimationEndCapture={() => setIconIdx(1)}
      transition={{
        duration: 1.5,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse",
      }}
    />
  </motion.svg>
);

const UserIcon = ({ className, setIconIdx }) => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <motion.path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      onAnimationEnd={() => setIconIdx(2)}
      transition={{
        duration: 1.5,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse",
      }}
    />
  </motion.svg>
);
