import { ResourceCard } from "@components/card/Resource";
import { Resource } from "@definitions/Resource";
import { ChevronRightIcon, PlusIcon } from "@heroicons/react/outline";
import Link from "next/link";

export const ResourceSection = ({ resources }: { resources: Resource[] }) => {
  return (
    <div className="flex flex-col w-full ">
      <div className="inline-flex items-end justify-between px-3">
        <h3 className="text-xl font-extrabold text-gray-800 md:text-2xl font-marianne lg:text-3xl xl:text-4xl dark:text-gray-200">
          Les dernières
          <span className="ml-1.5 text-blue-500 dark:text-blue-400">
            ressources
          </span>
        </h3>
        <Link href="/resource">
          <a className="flex flex-row items-center mb-1 text-sm font-medium transition duration-300 cursor-pointer font-spectral dark:text-gray-300 dark:hover:text-blue-500 hover:text-blue-500">
            Voir tout
            <ChevronRightIcon className="w-4 h-4 ml-2" />
          </a>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-6 pt-6 mt-6 border-t md:grid-cols-3 xl:grid-cols-4 dark:border-gray-700">
        {resources.map((resource, key) => (
          <ResourceCard {...resource} key={key} />
        ))}
      </div>
    </div>
  );
};
