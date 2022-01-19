import { SidebarDropdown } from "@components/dropdowns/SidebarDropdown";
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
      <div className="inline-flex items-center justify-end pl-6 space-x-4 lg:w-72 shrink-0 lg:pl-0 ">
        {/* <ThemeIcon /> */}
        <SidebarDropdown />
        <UserDropdown />
      </div>
    </div>
  );
};

const Search = () => (
  <div className="inline-flex items-center w-full px-2 text-gray-500 transition duration-300 ease-in-out bg-gray-100 rounded-full grow md:w-3/5 md:rounded-md dark:bg-gray-800 h-9 focus-within:bg-gray-200 font-marianne ring-offset-2 ring-blue-500 focus-within:ring-2">
    <input
      className="w-full pl-1 pr-3 font-bold text-gray-500 placeholder-gray-500 bg-transparent rounded outline-none placeholder:text-sm placeholder:mb-1 text-ellipsis"
      type="text"
      placeholder="Rechercher une ressource, un canal, un utilisateur..."
    />
    <SearchIcon className="w-5 h-5 my-auto text-secondary" />
  </div>
);
