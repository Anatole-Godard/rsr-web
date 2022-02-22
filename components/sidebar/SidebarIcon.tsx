import { motion } from "framer-motion";
import Link from "next/link";

export const SidebarIcon = ({
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
      <a className="flex w-full cursor-pointer xl:items-center xl:px-2 group">
        <div
          className={
            (active
              ? " dark:bg-red-800  text-blue-500 dark:text-red-100 dark:group-hover:bg-red-600 group-hover:bg-blue-600"
              : "dark:text-gray-100 text-gray-500 group-hover:bg-gray-600 ") +
            " relative flex-row items-center w-12 h-12 my-2 transition-all duration-300 ease-linear bg-gray-100 cursor-pointer flex-shrink-0 dark:bg-gray-800 group-hover:text-white group-hover:rounded-lg rounded-xl flex"
          }
        >
          <div className="inline-flex items-center justify-between w-full">
  
          {active ? (
            <motion.span
              layoutId={"activeIndicator"}
              className="w-1 h-6 duration-300 bg-blue-500 rounded-r dark:bg-red-500 group-hover:bg-blue-100 dark:group-hover:bg-red-100"
            ></motion.span>
          ) : (
            <span className="w-px h-px"></span>
          )}
          {icon({ className: "flex-shrink-0 w-5 h-5" })}
          <span className="w-px h-px"></span>
          </div>
  
          
        </div>
        <span
          className={
            (active ? "hidden" : "") +
            " ml-6  absolute w-auto p-2 m-2 text-xs font-bold text-white transition-all duration-100 origin-left scale-0 bg-gray-900 rounded-md shadow-md min-w-max left-14 group-hover:scale-100"
          }
        >
          {text}
        </span>
      </a>
    </Link>
  );