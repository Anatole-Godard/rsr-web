import { DocumentTextIcon, HomeIcon, UserIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import Link from "next/link";

import { motion } from "framer-motion"


export const SideBarAdmin = ({ config = { size : "normal" } }: { config?: any }) => {
  const router       = useRouter();
  const { pathname } = router;

  return (
    <div className="min-h-[calc(100vh-4rem)] z-[41] flex-col hidden px-2 bg-white shadow-lg top-16 xl:items-start md:flex min-w-max dark:bg-black dark:border-r dark:border-gray-900">
      <SideBarIcon
        icon={HomeIcon}
        active={pathname === "/admin"}
        href="/admin"
        text="Tableau de bord"
      />
      <Divider/>
      <SideBarIcon
        active={pathname === "/admin/resource"}
        icon={DocumentTextIcon}
        text="Ressources"
        href="/admin/resource"
      />
      <SideBarIcon
        active={pathname === "/admin/user"}
        icon={UserIcon}
        text="Utilisateurs"
        href="/admin/user"
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
    <div className="flex w-full cursor-pointer xl:items-center xl:px-2 group">
      <div
        className={
          (active
            ? " dark:bg-gray-100  text-blue-500 dark:text-red-500 dark:group-hover:bg-red-600 group-hover:bg-blue-600"
            : "dark:text-gray-100 text-gray-500 group-hover:bg-gray-600 ") +
          " relative flex-row items-center justify-between w-full min-h-[4rem] min-w-[4rem] mx-auto my-2 transition-all duration-300 ease-linear bg-gray-100 cursor-pointer dark:bg-gray-800 group-hover:text-white group-hover:rounded-lg rounded-xl flex flex-shrink-0 sidebar-icon"
        }
      >
        {active ? (
          <motion.span layoutId={"activeIndicator"} className="w-1 h-6 duration-300 bg-blue-500 rounded-r dark:bg-red-500 group-hover:bg-blue-100 dark:group-hover:bg-red-100"></motion.span>
        ) : (
          <span></span>
        )}
        {icon({ className : "flex-shrink-0 w-5 h-5" })}
        <span></span>

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
      <span
        className={
          (active ? "hidden" : "") +
          " ml-6  absolute w-auto p-2 m-2 text-xs font-bold text-white transition-all duration-100 origin-left scale-0 bg-gray-900 rounded-md shadow-md min-w-max left-14 group-hover:scale-100"
        }
      >
        {text}
      </span>
    </div>
  </Link>
);

const Divider = () => <hr className="sidebar-hr"/>;
