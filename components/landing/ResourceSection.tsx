import { ChevronRightIcon, PlusIcon } from "@heroicons/react/outline";
import Link from "next/link";

export const ResourceSection = ({ resources }) => {
  return (
    <div className="flex flex-col w-full ">
      <div className="inline-flex items-center justify-between p-3">
        <h3 className="text-xl font-extrabold text-gray-800 md:text-2xl lg:text-3xl xl:text-4xl dark:text-gray-200">
          Les dernières
          <span className="ml-1.5 text-blue-500 dark:text-blue-400">
            ressources
          </span>
        </h3>
        <Link href="/event/all">
          <a className="flex flex-row items-center text-sm font-medium transition duration-300 cursor-pointer dark:text-gray-300 dark:hover:text-blue-500 hover:text-blue-500">
            Voir tout
            <ChevronRightIcon className="w-4 h-4 ml-2" />
          </a>
        </Link>
      </div>
      
    </div>
  );
};
