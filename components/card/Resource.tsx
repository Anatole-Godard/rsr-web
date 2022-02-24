import { ChipList } from "@components/ui/ChipList";
import { Resource } from "@definitions/Resource";
import {
  ExternalLinkIcon,
  HandIcon,
  LocationMarkerIcon,
} from "@heroicons/react/outline";
import { ShareIcon } from "@heroicons/react/solid";
import { classes } from "@utils/classes";
import { types } from "constants/resourcesTypes";
import { formatDistance } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";

export const ResourceCard = (props: Resource) => {
  const { data, slug, owner } = props;
  const {
    attributes: { properties },
    type,
  } = data;
  const { name } = properties;

  return (
    <div className="flex flex-col w-full p-2 duration-300 bg-white h-fit max-h-max grow-0 rounded-xl dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 group">
      <Link href={"/resource/" + slug}>
        <a>
          <div
            className={classes(
              "flex items-center justify-center w-full h-32 rounded-lg duration-300",
              type === "location" &&
                "bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-800",
              type === "physical_item" &&
                "bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-800",
              type === "external_link" &&
                "bg-amber-100 hover:bg-amber-200 dark:bg-amber-800"
            )}
          >
            {type === "location" && (
              <LocationMarkerIcon className="w-6 h-6 text-indigo-700" />
            )}
            {type === "physical_item" && (
              <HandIcon className="w-6 h-6 text-emerald-700" />
            )}
            {type === "external_link" && (
              <ExternalLinkIcon className="w-6 h-6 text-amber-700" />
            )}
          </div>

          <div className="flex flex-col p-3">
            <h3 className="font-extrabold dark:text-gray-200 font-marianne">
              {name}
            </h3>
            <h4 className="text-xs font-semibold font-spectral">
              de {owner.fullName}
            </h4>
          </div>
          <hr className="mx-6 my-1 border-gray-200 dark:border-gray-700" />
        </a>
      </Link>
      <div className="inline-flex p-3">
        <div className="inline-flex overflow-x-hidden grow">
          <ChipList
            list={props.tags?.map((el, i) => ({ label: el, value: i })) || []}
            size="small"
            color={
              type === "location"
                ? "indigo"
                : type === "physical_item"
                ? "emerald"
                : "amber"
            }
          />
        </div>
        <button
          onClick={() => {
            if (navigator.share) {
              navigator
                .share({
                  title: `${name} - RSR`,
                  url:
                    document.location.protocol +
                    "//" +
                    document.location.host +
                    "/resource/" +
                    slug,
                })
                .then(() => console.log("Successful share"))
                .catch((error) => console.log("Error sharing", error));
            }
          }}
          className="inline-flex items-center px-1 py-1 transition duration-300 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 focus:outline-none group max-w-max dark:bg-gray-900 dark:bg-opacity-30 "
        >
          <span className="flex items-center justify-center w-8 h-8 duration-300 bg-gray-300 rounded-full dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 dark:bg-opacity-30">
            <ShareIcon className="w-5 h-5 text-gray-700 duration-300 select-none dark:text-gray-300 group-hover:text-gray-600 dark:group-hover:text-gray-400"></ShareIcon>
          </span>
        </button>
      </div>
    </div>
  );
};

export const ResourceCardSmall = (props: Resource) => {
  const { data, slug, createdAt } = props;
  const {
    attributes: { properties },
    type,
  } = data;
  const { name } = properties;
  return (
    <Link href={`/resource/${slug}`}>
      <a
        className={classes(
          "p-3 rounded-md h-24  min-w-[18rem] inline-flex group duration-300",
          type === "location" &&
            "bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-800",
          type === "physical_item" &&
            "bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-800",
          type === "external_link" &&
            "bg-amber-100 hover:bg-amber-200 dark:bg-amber-800"
        )}
      >
        <div
          className={classes(
            "h-full aspect-square rounded-md flex items-center justify-center duration-300",
            type === "location" &&
              "bg-indigo-200 group-hover:bg-indigo-300 dark:bg-indigo-800",
            type === "physical_item" &&
              "bg-emerald-200 group-hover:bg-emerald-300 dark:bg-emerald-800",
            type === "external_link" &&
              "bg-amber-200 group-hover:bg-amber-300 dark:bg-amber-800"
          )}
        >
          {type === "location" && (
            <LocationMarkerIcon className="w-6 h-6 text-indigo-700" />
          )}
          {type === "physical_item" && (
            <HandIcon className="w-6 h-6 text-emerald-700" />
          )}
          {type === "external_link" && (
            <ExternalLinkIcon className="w-6 h-6 text-amber-700" />
          )}
        </div>
        <div className="flex-col ml-3">
          <h3
            className={classes(
              "font-semibold font-marianne capitalize text-lg text-ellipsis break-words",
              type === "location" && "text-indigo-800",
              type === "physical_item" && "text-emerald-800",
              type === "external_link" && "text-amber-800"
            )}
          >
            {name}
          </h3>
          <p
            className={classes(
              "font-normal font-spectral text-sm",
              type === "location" && "text-indigo-600",
              type === "physical_item" && "text-emerald-600",
              type === "external_link" && "text-amber-600"
            )}
          >
            {types.find((t) => t.value === type)?.label}
          </p>
          <p
            className={classes(
              "font-normal font-spectral text-sm",
              type === "location" && "text-indigo-600",
              type === "physical_item" && "text-emerald-600",
              type === "external_link" && "text-amber-600"
            )}
          >
            {formatDistance(new Date(createdAt), new Date(), { locale: fr })}
          </p>
        </div>
      </a>
    </Link>
  );
};
