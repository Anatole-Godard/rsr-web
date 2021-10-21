import { MoonIcon, SearchIcon, SunIcon } from "@heroicons/react/outline";
import { useTheme } from "next-themes";

export const TopNavigation = () => {
  return (
    <div className="flex items-center justify-between top-navigation">
      <Title />
      <Search />
      <ThemeIcon />
    </div>
  );
};

const ThemeIcon = () => {
  const { theme, setTheme } = useTheme();
  const handleMode = () => setTheme(theme === "dark" ? "light" : "dark");
  return (
    <span onClick={handleMode}>
      {theme === "dark" ? (
        <SunIcon className="w-5 h-5 top-navigation-icon" />
      ) : (
        <MoonIcon className="w-5 h-5 top-navigation-icon" />
      )}
    </span>
  );
};

const Search = () => (
  <div className="search">
    <input className="search-input" type="text" placeholder="Rechercher une ressource, un canal, un utilisateur..." />
    <SearchIcon className="w-5 h-5 my-auto text-secondary" />
  </div>
);

const Title = () => (
  <h5 className="inline-flex items-center title-text">
    <span className="text-bleuFrance-500">Hello</span>{" "}
    <span className="text-rougeMarianne-500">RSR</span>
  </h5>
);
