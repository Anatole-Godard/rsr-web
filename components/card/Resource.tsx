import { ChipList } from "@components/ui/ChipList";
import { Resource } from "@definitions/Resource";
import {
  ExternalLinkIcon,
  HandIcon,
  LocationMarkerIcon,
  XCircleIcon,
  HeartIcon as HeartIconOutline,
} from "@heroicons/react/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/solid";
import { ChatAlt2Icon, ShareIcon } from "@heroicons/react/solid";
import { useAuth } from "@hooks/useAuth";
import { classes } from "@utils/classes";
import { types, visibilities } from "constants/resourcesTypes";
import { formatDistance } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";

export const ResourceCard = (props: Resource) => {
  const { user } = useAuth();
  const { data, slug, owner, visibility, validated, members, likes, comments } =
    props;
  const {
    attributes: { properties },
    type,
  } = data;
  const { name } = properties;

  return (
    <div
      className={classes(
        "flex flex-col w-full p-2 duration-300 bg-white h-fit max-h-max grow-0 border dark:border-gray-600 rounded-xl dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 group",
        visibility === "unlisted" && "border-amber-500 dark:border-amber-600",
        visibility === "private" && "border-red-500 dark:border-red-600"
      )}
    >
      <Link href={"/resource/" + slug}>
        <a>
          <div
            className={classes(
              "flex items-center relative justify-center w-full h-32 rounded-lg duration-300",
              type === "location" &&
                "bg-indigo-100 group-hover:bg-indigo-200 dark:bg-indigo-800 dark:group-hover:bg-indigo-900",
              type === "physical_item" &&
                "bg-emerald-100 group-hover:bg-emerald-200 dark:bg-emerald-800 dark:group-hover:bg-emerald-900",
              type === "external_link" &&
                "bg-amber-100 group-hover:bg-amber-200 dark:bg-amber-800 dark:group-hover:bg-amber-900",
              type === "event" &&
                "bg-red-100 group-hover:bg-red-200 dark:bg-red-800 dark:group-hover:bg-red-900"
            )}
          >
            <div
              className={classes(
                "flex flex-col space-y-2 text-xs font-spectral items-center",
                type === "location" && "text-indigo-700 dark:text-indigo-200",
                type === "physical_item" &&
                  "text-emerald-700 dark:text-emerald-200",
                type === "external_link" &&
                  "text-amber-700 dark:text-amber-200",
                type === "event" && "text-red-700 dark:text-red-200"
              )}
            >
              {types
                .find((t) => t.value === type)
                ?.icon.outline({ className: "w-6 h-6" })}
              {types.find((t) => t.value === type)?.label}
            </div>

            <div className="absolute truncate top-2 left-2">
              <div className="z-10 flex flex-row items-center px-2 py-1 text-xs font-medium text-gray-200 truncate bg-gray-800 shadow-xl rounded-xl">
                {visibilities
                  .find((v) => v.value === visibility)
                  ?.icon.outline({ className: "w-3 h-3 mr-1" })}
                {visibilities.find((v) => v.value === visibility).label}
                <span className="hidden md:block">
                  {visibility === "unlisted" &&
                    `: ${members?.length} ${
                      members.length > 1
                        ? "membres y ont accès"
                        : "membre y a accès"
                    }`}
                </span>
              </div>
            </div>
          </div>

          <div className="inline-flex items-center w-full">
            <div className="flex flex-col p-3 truncate grow">
              <h3 className="w-full font-extrabold leading-5 truncate dark:text-gray-200 font-marianne">
                {name}
              </h3>
              <h4 className="text-xs font-semibold font-spectral">
                de {owner.fullName}
              </h4>
            </div>

            {user?.data.uid === owner.uid && (
              <div className="mr-2 shrink-0">
                {/* {validated ? (
                  <CheckCircleIcon className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircleIcon className="w-4 h-4 text-red-800" />
                )} */}
                {!validated && <XCircleIcon className="w-4 h-4 text-red-600" />}
              </div>
            )}
          </div>
          <hr className="mx-6 my-1 border-gray-200 dark:border-gray-700" />
        </a>
      </Link>
      <div className="inline-flex p-2">
        <div className="inline-flex overflow-x-hidden grow">
          <ChipList
            list={
              props.tags
                ?.map((el, i) => (i < 2 ? { label: el.name, value: i } : null))
                .filter((e) => e !== null) || []
            }
            size="small"
            color={
              type === "location"
                ? "indigo"
                : type === "physical_item"
                ? "emerald"
                : type === "external_link"
                ? "amber"
                : "red"
            }
          />
        </div>
        <div className="flex flex-col mx-2 text-xs">
          {likes && (
            <div className="inline-flex items-center ">
              {likes.find((l) => l.uid === user?.data.uid) ? (
                <HeartIconSolid className="w-3 h-3 mr-0.5 text-red-500" />
              ) : (
                <HeartIconOutline className="w-3 h-3 mr-0.5 text-red-500" />
              )}{" "}
              {likes.length || 0}
            </div>
          )}
          {comments && (
            <div className="inline-flex items-center space-x-1">
              <ChatAlt2Icon className="w-3 h-3 mr-0.5 text-gray-700 dark:text-gray-200" />{" "}
              {comments.length || 0}
            </div>
          )}
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
          className="px-2 btn-gray shrink-0"
        >
          <ShareIcon className="w-4 h-4 select-none"></ShareIcon>
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
          "p-2 rounded-md h-24 w-[18rem] inline-flex group duration-300",
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
            "h-2/3 aspect-square rounded-md flex items-center justify-center duration-300",
            type === "location" &&
              "bg-indigo-200 group-hover:bg-indigo-300 dark:bg-indigo-800",
            type === "physical_item" &&
              "bg-emerald-200 group-hover:bg-emerald-300 dark:bg-emerald-800",
            type === "external_link" &&
              "bg-amber-200 group-hover:bg-amber-300 dark:bg-amber-800"
          )}
        >
          {type === "location" && (
            <LocationMarkerIcon className="w-4 h-4 text-indigo-700" />
          )}
          {type === "physical_item" && (
            <HandIcon className="w-4 h-4 text-emerald-700" />
          )}
          {type === "external_link" && (
            <ExternalLinkIcon className="w-4 h-4 text-amber-700" />
          )}
        </div>
        <div className="flex flex-col ml-3">
          <h3
            className={classes(
              "font-semibold font-marianne truncate text-lg w-full",
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
