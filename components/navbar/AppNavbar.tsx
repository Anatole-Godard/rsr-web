import { UserDropdown } from "@components/dropdowns/UserDropdown";
import { Logo } from "@components/ui/Logo";
import { SearchIcon } from "@heroicons/react/outline";

export const Navbar: React.FC<any> = ({
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
      <Logo />
      <Search />
      <div className="inline-flex items-center justify-end space-x-4 w-72">
        {/* <ThemeIcon /> */}
        <UserDropdown />
      </div>
    </div>
  );
};

const Search = () => (
  <div className="items-center hidden w-2/5 px-2 text-gray-500 transition duration-300 ease-in-out bg-gray-100 rounded-md md:flex dark:bg-gray-800 h-9 focus-within:bg-gray-200 font-marianne ring-offset-2 ring-blue-500 focus-within:ring-2">
    <input
      className="w-full pl-1 font-bold text-gray-500 placeholder-gray-500 bg-transparent rounded outline-none text-ellipsis"
      type="text"
      placeholder="Rechercher une ressource, un canal, un utilisateur..."
    />
    <SearchIcon className="w-5 h-5 my-auto text-secondary" />
  </div>
);
