import { ChatIcon, HomeIcon, ShoppingCartIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import Link from "next/link";

export const SideBar = () => {
  const router = useRouter();
  const { pathname } = router;

  return (
    <div className="min-h-[calc(100vh-4rem)] z-[41] flex-col hidden px-2 bg-white shadow-lg top-16 xl:items-start md:flex min-w-max dark:bg-black dark:border-r dark:border-gray-900">
      <SideBarIcon
        icon={HomeIcon}
        active={pathname === "/"}
        href="/"
        text="Accueil"
      />
      <Divider />
      <SideBarIcon
        active={pathname === "/store"}
        icon={ShoppingCartIcon}
        text="Catalogue"
        href="/store"
      />
      <SideBarIcon
        icon={ChatIcon}
        active={pathname === "/channel"}
        text="Canaux"
        href="/channel"
      />
    </div>
  );
};

const SideBarIcon = ({
  icon,
  text = "tooltip 💡",
  active = false,
  href,
}: {
  icon: JSX.Element | any;
  text?: string;
  active?: boolean;
  href: string;
}) => (
  <Link href={href}>
    <div className="flex w-full cursor-pointer xl:items-center xl:px-4 group">
      <div
        className={
          (active
            ? " dark:bg-gray-100  text-blue-500 group-hover:bg-blue-600"
            : "dark:text-gray-100 text-gray-500 group-hover:bg-gray-600 ") +
          " relative flex-row items-center justify-center w-full min-h-[4rem] min-w-[4rem] mx-auto mt-2 mb-2 transition-all duration-300 ease-linear bg-gray-100 cursor-pointer dark:bg-gray-800 group-hover:text-white group-hover:rounded-lg rounded-xl  flex flex-shrink-0 px-5 "
        }
      >
        
        {icon({ className: "flex-shrink-0 w-5 h-5" })}
        <span
          className={
            (active ? "hidden" : "") +
            " ml-6  absolute w-auto p-2 m-2 text-xs font-bold text-white transition-all duration-100 origin-left scale-0 bg-gray-900 rounded-md shadow-md min-w-max left-14 group-hover:scale-100"
          }
        >
          {text}
        </span>
        {/* <span
          className={
            (active ? "flex" : "hidden xl:flex") +
            " text-[0.65rem] font-bold flex-col xl:flex-row xl:items-center"
          }
        >
          <hr
            className={
              (active
                ? "border-blue-500 dark:border-blue-100  "
                : "border-gray-500 dark:border-gray-100 ") +
              " hidden xl:flex pt-1 mx-2 mt-1 duration-300 ease-linear border-t-2  xl:pt-0 xl:mt-0 xl:h-4 group-hover:border-white xl:border-t-0 xl:border-l-2 "
            }
          />
          {text}
        </span> */}
      </div>
    </div>
  </Link>
);

const Divider = () => <hr className="sidebar-hr" />;
