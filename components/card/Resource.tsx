import { ChipList } from "@components/ui/ChipList";
import { Resource } from "@definitions/Resource";
import { ShareIcon } from "@heroicons/react/solid";
import Link from "next/link";

export const ResourceCard = (props: Resource) => {
  return (
    <div className="flex flex-col w-full p-2 duration-300 bg-white rounded-xl dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900">
      <span className="flex items-center justify-center w-full h-32 bg-blue-200 rounded-lg dark:bg-blue-900"></span>

      <Link href={"/resource/" + props.slug}>
        <a>
          <div className="flex flex-col p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex flex-col">
                <h3 className="font-extrabold dark:text-gray-200">
                  {props.data.attributes?.properties?.name}
                </h3>
              </div>
            </div>
            <hr className="mx-6 mt-4 border-gray-200 dark:border-gray-700" />
          </div>
        </a>
      </Link>
      <div className="inline-flex p-3">
        <div className="inline-flex flex-grow overflow-x-hidden">
          <ChipList list={props.tags || []} size="small" color="blue"/>
        </div>
        <button
          onClick={() => {
            if (navigator.share) {
              navigator
                .share({
                  title: `${props.data.attributes.properties.name} - OpenMeet`,
                  text: "Check out this group on OpenMeet.",
                  url:
                    document.location.protocol +
                    "//" +
                    document.location.host +
                    "/group/" +
                    props.slug,
                })
                .then(() => console.log("Successful share"))
                .catch((error) => console.log("Error sharing", error));
            }
          }}
          className="inline-flex items-center px-1 py-1 transition duration-300 bg-gray-100 rounded-full cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800 focus:outline-none group max-w-max dark:bg-gray-900 dark:bg-opacity-30 "
        >
          <span className="flex items-center justify-center w-8 h-8 duration-300 bg-gray-300 rounded-full dark:bg-gray-800 hover:bg-blue-300 dark:hover:bg-blue-700 dark:bg-opacity-30">
            <ShareIcon className="w-5 h-5 text-gray-700 duration-300 select-none dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400"></ShareIcon>
          </span>
        </button>
      </div>
    </div>
  );
};
