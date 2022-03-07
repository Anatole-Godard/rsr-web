import {
  ArrowSmLeftIcon,
  PlusIcon,
  // QrcodeIcon,
  UserGroupIcon,
} from "@heroicons/react/outline";

// var QRCode = require("qrcode.react");

import Link from "next/link";
import { Channel } from "@definitions/Channel";
import { classes } from "@utils/classes";
import { UserMinimum } from "@definitions/User";
import Image from "next/image";
import { useSearch } from "@hooks/useSearch";

export const Sidebar = ({
  channels,
  selectedChannelSlug,
}: {
  channels: Channel[];
  selectedChannelSlug?: string;
}) => {
  const { search, filtered, onChange } = useSearch<Channel>("name", channels);

  return (
    <>
      <div
        className={classes(
          "w-full h-full items-center shrink-0 flex-col p-3 space-y-2 bg-gray-100 dark:bg-gray-900 md:w-48 lg:w-56",
          selectedChannelSlug ? "lg:rounded-tl-xl" : "lg:rounded-t-xl",
          "hidden md:flex" //responsive
        )}
      >
        <div className="inline-flex items-center w-full gap-2">
          {selectedChannelSlug && (
            <Link href="/channel">
              <a
                className={classes(
                  "btn-gray px-2",
                  selectedChannelSlug ? "w-[calc(50%-0.25rem)] " : ""
                )}
              >
                <ArrowSmLeftIcon className="w-4 h-4 mr-1 shrink-0" />
                Retour
              </a>
            </Link>
          )}
          <Link href="/channel/create">
            <a
              className={classes(
                "btn-bleuFrance ",
                selectedChannelSlug
                  ? "w-[calc(50%-0.25rem)] px-2"
                  : "w-full px-3"
              )}
            >
              <PlusIcon className="w-4 h-4 mr-2 shrink-0" />
              Créer
            </a>
          </Link>
        </div>
        <div className="w-full">
          <label className="relative text-gray-400 focus-within:text-gray-600">
            <UserGroupIcon className="absolute w-4 h-4 transform -translate-y-1/2 pointer-events-none top-1/2 left-3" />
            <input
              id="search"
              name="search"
              type="text"
              autoComplete="off"
              value={search}
              onChange={onChange}
              required
              className="input px-5 py-2 pl-[2.25rem] text-ellipsis bg-white placeholder-gray-500"
              placeholder="Rechercher un salon"
            />
          </label>
        </div>
        <div className="flex flex-col w-full space-y-1 overflow-y-auto grow">
          {filtered.map((el, key) => (
            <ChatOverview
              key={key}
              {...el}
              position={
                key === 0 && filtered.length !== 1
                  ? "first"
                  : key === filtered.length - 1 && filtered.length !== 1
                  ? "last"
                  : null
              }
              active={selectedChannelSlug === el.slug}
            />
          ))}
        </div>
      </div>

      <div className="inline-flex md:hidden items-center w-screen h-[4.5rem] p-2 space-x-3">
        <div className="flex flex-col space-y-1">
          {selectedChannelSlug && (
            <Link href="/channel">
              <a
                className={classes(
                  "btn-gray py-2 text-xs px-2",
                  selectedChannelSlug ? "h-1/2" : ""
                )}
              >
                <ArrowSmLeftIcon className="w-3 h-3 mr-0.5" />
                Retour
              </a>
            </Link>
          )}
          <Link href="/channel/create">
            <a
              className={classes(
                "btn-bleuFrance  py-2 text-xs px-2",
                selectedChannelSlug ? "h-1/2" : " w-16"
              )}
            >
              <PlusIcon className="w-3 h-3 mr-0.5" />
              Créer
            </a>
          </Link>
        </div>
        <div className="inline-flex items-center h-full space-x-1 overflow-x-auto overflow-y-hidden w-max">
          {filtered.map((el, key) => (
            <ChatOverview
              key={key}
              {...el}
              position={
                key === 0 && filtered.length !== 1
                  ? "first"
                  : key === filtered.length - 1 && filtered.length !== 1
                  ? "last"
                  : null
              }
              active={selectedChannelSlug === el.slug}
            />
          ))}
        </div>
      </div>
    </>
  );
};

const ChatOverview = ({
  slug,
  name,
  image = null,
  active = false,
  members = [],
  position = null,
  visibility
}: {
  slug: string;
  name: string;
  image?: any;
  active?: boolean;
  members: UserMinimum[];
  position?: "first" | "last";
  visibility: "public" | "private";
}) => {
  //TODO: replace a by Link but still doing getServerSideProps even if already on channel/[slug]
  return (
    <a
      href={`/channel/${slug}`}
      className={classes(
        "py-1 px-2 md:px-3 md:py-3 inline-flex items-center rounded-md w-max min-w-[5rem] md:w-full h-full md:h-16",
        active
          ? "bg-blue-50 dark:bg-blue-900 border-bleuFrance-300 md:border"
          : "bg-white dark:bg-gray-800",
        position === "first"
          ? "rounded-l-xl md:rounded-bl-md md:rounded-t-xl"
          : "",
        position === "last"
          ? "rounded-r-xl md:rounded-tr-md md:rounded-b-xl"
          : ""
      )}
    >
      {image ? (
        <div className="flex items-center justify-center w-6 h-6 rounded-full select-none md:w-8 md:h-8 bg-bleuFrance-50 ring-2 shrink-0 ring-offset-2 ring-bleuFrance-200">
          <Image src={image.url} alt={slug} width={24} height={24} />
        </div>
      ) : (
        <span className="flex items-center justify-center w-6 h-6 rounded-full shrink-0 md:w-8 md:h-8 text-bleuFrance-500 bg-bleuFrance-50 ring-2 ring-offset-2 ring-bleuFrance-200 dark:bg-bleuFrance-700">
          <UserGroupIcon className="w-3 h-3 md:w-4 md:h-4 shrink-0" />
        </span>
      )}
      <div className="flex flex-col ml-3 grow">
        <h3 className="text-sm text-gray-700 truncate select-none font-marianne dark:text-gray-300">
          {name}
        </h3>
        {visibility === "public" ? (
          <h4 className="hidden mt-1 text-xs text-gray-500 truncate select-none md:block font-spectral">
            Groupe public
          </h4>
        ) : (
          <h4 className="hidden mt-1 text-xs text-gray-500 truncate select-none md:block font-spectral">
            Privé - {members.length} {members.length < 1 ? "membre" : "membres"}
          </h4>
        )}
      </div>
    </a>
  );
};
