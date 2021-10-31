import {
  ArrowsExpandIcon,
  ChevronLeftIcon,
  PlusIcon,
  QrcodeIcon,
  UserGroupIcon,
} from "@heroicons/react/outline";
import { useState } from "react";

var QRCode = require("qrcode.react");

import Link from "next/link";
import { fakeChannelInvite } from "@utils/faker.dev";

export const Sidebar = ({
  channels,
  canExpand,
  canReturn,
  isExpanded,
  selectedChannelSlug,
  isCreatingChannel,
}: {
  channels: {
    slug: string;
    name: string;
    messages: {
      content: string;
      createdAt: string;
    }[];
    photoURL?: string;
  }[];
  canExpand: boolean;
  canReturn: boolean;
  isExpanded: boolean;
  selectedChannelSlug?: string;
  isCreatingChannel?: boolean;
}) => {
  const [expanded, setExpanded] = useState<boolean>(isExpanded);

  const toggleExpanded = () => {
    if (canExpand) setExpanded(!expanded);
  };

  return (
    <div
      className={
        "w-full h-auto m-0 items-center flex flex-row xl:flex-col justify-between xl:rounded-t-xl bg-gray-100 dark:bg-gray-900 " +
        (expanded ? "xl:w-64" : "xl:w-full xl:max-w-max")
      }
    >
      <div className="flex flex-row w-full xl:flex-col">
        <div className="flex flex-row items-center justify-center p-0 m-0 xl:h-16 xl:flex-col">
          <div
            className={
              "flex flex-col xl:flex-row items-center w-full px-4 " +
              (expanded ? "justify-start xl:space-x-4" : "justify-center") +
              (!expanded && canReturn && canExpand ? " xl:space-x-4" : "")
            }
          >
            {canReturn && (
              <Link href="/channel">
                <a className="flex items-center justify-center w-8 h-8 p-1 m-1 text-blue-500 duration-300 ease-linear bg-blue-200 rounded-full hover:bg-blue-300 hover:text-blue-600 active:bg-blue-400 active:text-blue-700 dark:bg-blue-700">
                  <ChevronLeftIcon className="w-4 h-4" />
                </a>
              </Link>
            )}
            {canExpand && (
              <button
                className="items-center justify-center hidden w-8 h-8 p-1 m-1 text-gray-500 duration-300 ease-linear bg-gray-200 rounded-full xl:flex hover:bg-gray-300 hover:text-gray-600 active:bg-gray-400 active:text-gray-700 dark:bg-gray-700"
                onClick={toggleExpanded}
              >
                <ArrowsExpandIcon className="w-4 h-4" />
              </button>
            )}
            {expanded && (
              <p className="hidden my-auto mr-auto text-lg font-bold tracking-wider text-gray-600 align-middle xl:flex dark:text-gray-400">
                Salons
              </p>
            )}
          </div>
        </div>
        {!isCreatingChannel && (
          <div
            className={
              "p-2 m-2  flex flex-row xl:flex-col h-full  overflow-x-scroll xl:overflow-x-hidden xl:overflow-y-auto bg-gray-50 rounded-xl dark:bg-gray-800 " +
              (expanded && selectedChannelSlug
                ? "xl:max-h-[52vh] "
                : "xl:max-h-[65vh] ") +
              (expanded && !selectedChannelSlug ? " xl:max-h-[65vh] " : "") +
              (canExpand && !selectedChannelSlug
                ? "max-w-[80vw] "
                : "max-w-[70vw]")
            }
          >
            {channels?.map((el, key) => (
              <ChatOverview
                key={key}
                isFirst={key === 0}
                isLast={false}
                slug={el.slug}
                name={el.name}
                photoURL={el.photoURL}
                expanded={expanded}
                active={selectedChannelSlug === el.slug}
              />
            ))}

            <Link href="/channel/create">
              <a
                className={
                  "flex flex-row items-center w-full px-4 py-2 text-sm leading-5 text-gray-700 transition duration-300 ease-in-out dark:text-gray-200 hover:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 focus:outline-none xl:rounded-b-xl rounded rounded-r-xl xl:rounded-r xl:rounded-br-xl active:bg-blue-50" +
                  (!expanded ? " justify-center" : "")
                }
              >
                <span className="flex items-center justify-center w-8 h-8 p-2 text-blue-500 bg-blue-200 rounded-full dark:bg-blue-700">
                  <PlusIcon className="w-4 h-4" />
                </span>

                {expanded && (
                  <div className="flex-col hidden ml-2 xl:flex">
                    <span className="text-[0.65rem] select-none text-gray-400 dark:text-gray-300">
                      Create
                    </span>
                  </div>
                )}
              </a>
            </Link>
          </div>
        )}
      </div>
      {selectedChannelSlug && (
        <div className="justify-center hidden w-full p-4 xl:flex">
          {expanded ? (
            <span
              className="flex items-center justify-center p-1 text-blue-500 duration-300 ease-linear bg-blue-200 cursor-pointer active:bg-blue-100 hover:bg-blue-300 rounded-xl dark:bg-blue-700"
              onClick={toggleExpanded}
            >
              <QRCode
                bgColor="rgba(191, 219, 254, 0)"
                fgColor="rgb(59, 130, 246)"
                renderAs="svg"
                includeMargin
                size={192}
                value={JSON.stringify(fakeChannelInvite())}
              />
            </span>
          ) : (
            <button
              onClick={toggleExpanded}
              className="flex items-center justify-center w-16 h-16 p-1 m-1 text-blue-500 duration-300 ease-linear bg-blue-200 rounded-xl hover:bg-blue-300 hover:text-blue-600 active:bg-blue-400 active:text-blue-700 dark:bg-blue-700"
            >
              <QrcodeIcon className="w-8 h-8 fill-current " />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const ChatOverview = ({
  isFirst,
  isLast,
  slug,
  name,
  photoURL,
  expanded,
  active,
}: {
  isFirst: boolean;
  isLast: boolean;
  slug: string;
  name: string;
  photoURL?: string;
  expanded: boolean;
  active: boolean;
}) => {
  let rounded = " ";
  if (isFirst)
    rounded +=
      "xl:rounded-t-xl xl:rounded-tl-xl rounded-l-xl xl:rounded-l rounded-b ";
  // if (isLast) rounded += "rounded-b-xl rounded-t ";
  if (!isFirst && !isLast) rounded += "rounded mx-1 xl:mx-0 xl:my-1";

  return (
    <Link href={"/channel/" + slug}>
      <a
        className={
          "flex flex-row items-center w-full min-w-max px-3 xl:px-4 xl:py-2 text-sm leading-5 text-gray-700 transition duration-300 ease-in-out dark:text-gray-200 hover:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 focus:outline-none active:bg-blue-50" +
          (active ? " bg-blue-200 dark:bg-blue-800" : "") +
          (!expanded ? " justify-center" : "") +
          rounded
        }
      >
        {photoURL ? (
          <img
            src={photoURL}
            alt={slug}
            className="flex-shrink-0 w-8 h-8 rounded-full select-none"
          />
        ) : (
          <span className="flex items-center justify-center flex-shrink-0 w-8 h-8 p-2 text-blue-500 bg-blue-200 rounded-full dark:bg-blue-700">
            <UserGroupIcon className="w-4 h-4" />
          </span>
        )}

        {expanded && (
          <div className="flex-col hidden ml-2 xl:flex">
            <span className="text-[0.65rem] select-none text-gray-400 dark:text-gray-300">
              {name}
            </span>
          </div>
        )}
      </a>
    </Link>
  );
};
