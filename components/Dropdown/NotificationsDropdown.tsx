/* eslint-disable @next/next/no-img-element */
import React, { ComponentProps } from "react";
import { Menu, Transition } from "@headlessui/react";
import { classes } from "libs/classes";
import {
  BellIcon as BellOutlineIcon,
  ChatAlt2Icon,
  ChatIcon,
  CheckIcon,
  ExclamationIcon,
  ExternalLinkIcon,
  ThumbUpIcon,
  UserGroupIcon,
  XIcon,
} from "@heroicons/react/outline";
import { BellIcon as BellSolidIcon } from "@heroicons/react/solid";
import { useAuth } from "@hooks/useAuth";
import { useNotifications } from "@hooks/useNotifications";
import { Notification } from "@definitions/Notification";
import { useRouter } from "next/router";
import { formatDistance } from "date-fns";
import { fr } from "date-fns/locale";
import { Channel, ChannelMinimum } from "@definitions/Channel";
import Link from "next/link";
import useFetchRSR from "@hooks/useFetchRSR";
import { ResourceMinimum } from "@definitions/Resource";

export const NotificationsDropdown = () => {
  const { user } = useAuth();
  const { notifications, removeNotification } = useNotifications();

  const {
    data: channels,
    error,
    loading,
  }: {
    data?: Channel[];
    error?: any;
    loading: boolean;
  } = useFetchRSR("/api/channel", user?.session);

  return user?.data ? (
    <Menu
      as="div"
      className="relative flex items-center h-full"
      key="notifications_dropdown-menu"
    >
      {({ open }) => (
        <>
          <Menu.Button key="notifications_dropdown-btn">
            <div className="flex items-center">
              <span
                className={classes(
                  "inline-flex items-center justify-center w-8 h-8 text-sm duration-300  rounded-full hover:bg-gray-300 active:bg-gray-100  dark:bg-gray-900 dark:active:bg-gray-900  dark:hover:bg-gray-700",
                  open
                    ? "bg-gray-200 dark:bg-gray-700"
                    : "bg-gray-100  dark:bg-gray-800"
                )}
              >
                <div className="flex items-center justify-center w-full h-full text-gray-700 align-middle border-none rounded-full select-none dark:text-gray-300">
                  {notifications.length < 1 ? (
                    <BellOutlineIcon
                      key="notifications_dropdown-icon_empty"
                      className={classes("w-4 h-4 ", open ? "" : "")}
                    />
                  ) : (
                    <BellSolidIcon
                      key="notifications_dropdown-icon_full"
                      className={classes("w-4 h-4 ", open ? "" : "")}
                    />
                  )}
                  {notifications?.length > 0 && (
                    <span
                      style={{ marginTop: "-22px", marginRight: "-22px" }}
                      className="absolute flex items-center justify-center"
                    >
                      <span className="w-3 h-3 bg-red-400 rounded-full opacity-75 animate-ping" />
                      <span className="absolute w-2 h-2 bg-red-600 rounded-full" />
                    </span>
                  )}
                </div>
              </span>
            </div>
          </Menu.Button>
          <Transition
            show={open}
            enter="transform transition duration-100 ease-in"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transform transition duration-75 ease-out"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Menu.Items
              static
              className={
                "bg-white md:origin-top-right fixed md:absolute left-0 md:left-auto md:right-0 mt-8 dark:bg-gray-900 text-base z-50 float-left py-2 list-none text-left rounded-xl shadow-lg w-full md:w-96 lg:w-[32rem]"
              }
            >
              <div className="inline-flex items-center justify-between w-full px-4 py-2 text-xs text-gray-400 font-marianne">
                Salons
              </div>

              {!loading ? (
                !error ? (
                  <div className="relative flex w-full gap-4 pb-4 overflow-x-auto snap-x">
                    {channels?.map((channel: Channel, idx) => (
                      <div
                        key={idx}
                        className={classes(
                          "snap-center shrink-0 first:pl-4 last:pr-4"
                        )}
                      >
                        <ChannelComponent {...channel} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full h-24">
                    <p className="font-spectral">
                      Une erreur est survenue lors de la récupération des
                      données
                    </p>
                  </div>
                )
              ) : (
                <div className="flex items-center justify-center w-full h-24">
                  <p className="font-spectral">Chargement...</p>
                </div>
              )}

              <div className="inline-flex items-center justify-between w-full px-4 py-2 text-xs text-gray-400 font-marianne">
                <span className="inline-flex items-center">
                  Notifications
                  <span className="bg-gray-100 h-4 w-4 flex justify-center items-center text-gray-800 text-[0.55rem] font-semibold ml-2 rounded-full dark:bg-gray-700 dark:text-gray-300">
                    {notifications.length}
                  </span>
                </span>
                {notifications.length > 0 && (
                  <button
                    // onClick={readAllNotifications}
                    className="px-2 py-1 text-xs rounded-full btn-bleuFrance"
                  >
                    <CheckIcon className="w-4 h-4 mr-1 " />
                    Tout lire
                  </button>
                )}
              </div>

              {notifications?.length > 0 ? (
                <div className="flex flex-col px-3 lg:px-6">
                  {notifications
                    .sort(
                      (a, b) =>
                        new Date(b.createdAt.toString()).getTime() -
                        new Date(a.createdAt.toString()).getTime()
                    )
                    .map(
                      (e, i) =>
                        i < 3 && (
                          <NotificationComponent
                            key={i}
                            {...e}
                            remove={removeNotification}
                          />
                        )
                    )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-24">
                  <p className="font-semibold font-marianne">
                    Aucune notification à afficher
                  </p>
                  <p className="text-sm font-spectral">Vous êtes à jour !</p>
                </div>
              )}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  ) : null;
};

const notifications = [
  {
    type: "comment",
    message: "a commenté votre publication",
    icon: {
      className: "bg-green-100 text-green-700",
      component: (props: ComponentProps<"svg">) => <ChatIcon {...props} />,
    },
  },
  {
    type: "message",
    message: "a envoyé un message",
    icon: {
      className: "bg-bleuFrance-100 text-bleuFrance-700",
      component: (props: ComponentProps<"svg">) => <ChatAlt2Icon {...props} />,
    },
  },
  {
    type: "like",
    message: "a aimé votre publication",
    icon: {
      className: "bg-green-100 text-green-700",
      component: (props: ComponentProps<"svg">) => <ThumbUpIcon {...props} />,
    },
  },
  {
    type: "report",
    message: "Votre demande de signalement a été traitée",
    icon: {
      className: "bg-green-100 text-green-700",
      component: (props: ComponentProps<"svg">) => <ExclamationIcon {...props} />,
    },
  },
];

interface NotificationComponentProps extends Notification {
  remove: (id: string) => void;
}

const NotificationComponent = ({
  _id,
  user,
  document,
  type,
  createdAt,
  emitter,
  remove,
}: NotificationComponentProps) => {
  const router = useRouter();
  const goTo = (id: string) => {
    remove(id);

    if ((document as ChannelMinimum)?.name)
      router.push(`/channel/${document.slug}`);

    if ((document as ResourceMinimum)?.data?.attributes.properties.name)
      router.push(`/resource/${document.slug}`);
  };

  return (
    <div
      className="w-full pt-3 pb-3 mb-3 text-gray-900 duration-300 border-b select-none shrink md:max-w-sm dark:text-gray-300 lg:max-w-lg last:border-b-0 dark:border-gray-700 last:pb-0"
      role="alert"
    >
      <div className="flex items-start justify-between w-full">
        <div className="inline-flex items-start pl-2">
          <div className="relative inline-block shrink-0">
            {emitter && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="w-12 h-12 rounded-full bg-bleuFrance-50 ring-2 ring-offset-2 ring-bleuFrance-200"
                  src={emitter.photoURL || "/uploads/user/default.png"}
                  alt={emitter.fullName}
                />
                <span
                  className={classes(
                    "absolute -bottom-2 -right-2 inline-flex items-center justify-center w-6 h-6 rounded-full",
                    notifications.find((e) => e.type === type).icon.className
                  )}
                >
                  {notifications
                    .find((e) => e.type === type)
                    ?.icon?.component({ className: "w-4 h-4" })}
                </span>
              </>
            )}
          </div>
          <div className="ml-5 text-sm font-normal">
            <h4 className="text-sm font-semibold text-gray-900 font-marianne dark:text-white">
              {emitter?.fullName || "Administrateur"}
            </h4>
            <div className="text-xs font-normal font-spectral">
              {notifications.find((e) => e.type === type).message}
              {(document as ChannelMinimum)?.name && (
                <span className="inline-flex items-center ml-1">
                  dans{" "}
                  <a
                    onClick={() => goTo(_id)}
                    className="ml-1 underline cursor-pointer text-bleuFrance-500 dark:text-bleuFrance-100"
                  >
                    {(document as ChannelMinimum)?.name}
                  </a>
                </span>
              )}
              {(document as ResourceMinimum)?.data?.attributes.properties
                .name && (
                <span className="inline-flex items-center ml-1">
                  <a
                    onClick={() => goTo(_id)}
                    className="underline cursor-pointer text-bleuFrance-500 dark:text-bleuFrance-100"
                  >
                    {
                      (document as ResourceMinimum)?.data?.attributes.properties
                        .name
                    }
                  </a>
                </span>
              )}
            </div>
            <span className="text-xs font-medium text-bleuFrance-600 font-spectral dark:text-bleuFrance-200">
              {formatDistance(new Date(createdAt), new Date(), { locale: fr })}
            </span>
          </div>
        </div>
        <div className="flex flex-col space-y-3">
          <button
            onClick={() => remove(_id)}
            type="button"
            className="px-1 py-1 text-xs btn-gray"
            data-collapse-toggle="toast-notification"
            aria-label="Fermer"
          >
            <span className="sr-only">Fermer</span>
            <XIcon className="w-4 h-4" />
          </button>
          {type !== "report" && (
            <button
              type="button"
              onClick={() => goTo(_id)}
              className="px-1 py-1 text-xs btn-gray"
              data-collapse-toggle="toast-notification"
              aria-label="Aller vers"
            >
              <span className="sr-only">Aller vers</span>
              <ExternalLinkIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface ChannelComponentProps extends Channel {}

const ChannelComponent = (props: ChannelComponentProps) => {
  return (
    <Link href={"/channel/" + props.slug}>
      <a className="flex h-full flex-col items-center min-h-[6rem] w-24 p-2 duration-300 rounded-xl hover:bg-bleuFrance-50 dark:hover:bg-bleuFrance-900">
        <div className="relative flex items-center justify-center w-16 h-16 m-1 mr-2 text-xl text-white rounded-full">
          {props.image ? (
            <img
              className="w-16 h-16 rounded-full bg-bleuFrance-50 ring-2 ring-offset-2 ring-bleuFrance-200"
              alt={props.slug || "?"}
              src={props.image.url}
            />
          ) : (
            <span className="flex items-center justify-center w-16 h-16 p-5 rounded-full text-bleuFrance-500 dark:text-bleuFrance-200 bg-bleuFrance-50 ring-2 ring-offset-2 ring-bleuFrance-200 dark:bg-bleuFrance-700">
              <UserGroupIcon className="w-8 h-8" />
            </span>
          )}
          {/* {isUnread && (
            <span className="absolute bottom-0 right-0 flex items-center justify-center">
              <span className="w-4 h-4 bg-red-400 rounded-full opacity-75 animate-ping" />
              <span className="absolute w-3 h-3 bg-red-600 rounded-full" />
            </span>
          )} */}
        </div>
        <div className="flex flex-col justify-center w-full px-1 mt-1 text-xs text-center truncate">
          <span className="truncate font-spectral">{"#" + props.slug}</span>
          {props.messages.length > 0 && (
            <span className="text-[0.55rem] leading-4">
              {formatDistance(
                new Date(
                  props.messages?.[props.messages.length - 1]?.createdAt
                ),
                new Date(),
                {
                  locale: fr,
                  addSuffix: true,
                }
              )}
            </span>
          )}
        </div>
      </a>
    </Link>
  );
};
