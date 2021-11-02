import { UserDropdown } from "@components/dropdowns/UserDropdown";
import {
  MoonIcon,
  SearchIcon,
  SunIcon,
  UserIcon,
} from "@heroicons/react/outline";
import { useTheme } from "next-themes";

export const TopNavigation: React.FC<any> = ({
  config = { shadow: true, backgroundColor: "bg-white dark:bg-gray-900" },
}: {
  config: { shadow: boolean; backgroundColor: string };
}) => {
  return (
    <div
      className={
        (config.shadow ? "shadow-md " : " ") +
        config.backgroundColor +
        " inline-flex items-center justify-between w-full z-40 h-16 px-6 m-0 bg-white dark:bg-black"
      }
    >
      <Title />
      <Search />
      <div className="inline-flex items-center justify-end space-x-4 w-72">
        {/* <ThemeIcon /> */}
        <UserDropdown />
      </div>
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
  <div className="items-center hidden w-2/5 px-2 text-gray-500 transition duration-300 ease-in-out bg-gray-100 rounded-md md:flex dark:bg-gray-800 h-9 focus-within:bg-gray-200 font-marianne">
    <input
      className="w-full pl-1 font-bold text-gray-500 placeholder-gray-500 bg-transparent rounded outline-none"
      type="text"
      placeholder="Rechercher une ressource, un canal, un utilisateur..."
    />
    <SearchIcon className="w-5 h-5 my-auto text-secondary" />
  </div>
);

const Title = () => (
  <h5 className="inline-flex items-center my-auto ml-2 text-xl font-extrabold tracking-wider text-gray-500 uppercase transition duration-300 ease-in-out w-72 text-opacity-80">
    <span className="text-bleuFrance-500">Hello</span>{" "}
    <span className="ml-1 text-rougeMarianne-500">RSR</span>
  </h5>
);