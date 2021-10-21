import { ChatIcon, HomeIcon, ShoppingCartIcon } from "@heroicons/react/outline";

export const SideBar = () => {
  return (
    <div className="sidebar">
      <SideBarIcon icon={<HomeIcon className="w-5 h-5" />} text="Accueil" />
      <Divider />
      <SideBarIcon icon={<ShoppingCartIcon className="w-5 h-5" />} text="Catalogue" />
      <SideBarIcon icon={<ChatIcon className="w-5 h-5" />} text="Canaux" />
    </div>
  );
};

const SideBarIcon = ({
  icon,
  text = "tooltip 💡",
}: {
  icon: JSX.Element;
  text?: string;
}) => (
  <div className="flex items-center w-full cursor-pointer xl:px-4 group">
    <div className="flex-shrink-0 sidebar-icon">
      {icon}
      <span className="xl:hidden sidebar-tooltip group-hover:scale-100">
        {text}
      </span>
    </div>
    <span className="hidden w-full px-6 py-3 ml-4 capitalize transition-all duration-300 ease-linear bg-gray-100 dark:bg-gray-800 rounded-xl group-hover:rounded-2xl group-hover:text-white group-hover:bg-bleuFrance-400 xl:flex font-marianne dark:group-hover:bg-bleuFrance-600">
      {text}
    </span>
  </div>
);

const Divider = () => <hr className="sidebar-hr" />;
