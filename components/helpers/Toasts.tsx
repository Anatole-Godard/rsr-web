import { ChatAlt2Icon, ChatIcon, ThumbUpIcon } from "@heroicons/react/solid";
import { ExternalLinkIcon, XIcon } from "@heroicons/react/outline";
import { formatDistance } from "date-fns";
import fr from "date-fns/locale/fr";
import { classes } from "@utils/classes";
import { useNotifications } from "@hooks/useNotifications";
import { Notification } from "@definitions/Notification";
import Link from "next/link";
import { useRouter } from "next/router";

const notifications = [
  {
    type: "comment",
    message: "a commenté votre publication",
    icon: {
      className: "bg-green-100 text-green-700",
      component: ChatIcon,
    },
  },
  {
    type: "message",
    message: "a envoyé un message",
    icon: {
      className: "bg-blue-100 text-blue-700",
      component: ChatAlt2Icon,
    },
  },
  {
    type: "like",
    message: "a aimé votre publication",
    icon: {
      className: "bg-green-100 text-green-700",
      component: ThumbUpIcon,
    },
  },
];

export const Toasts = () => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed z-50 flex flex-col w-full max-w-sm px-4 pt-2 space-y-4 right-2 top-20 md:pt-0 md:px-0 md:right-12">
      {notifications.map((e, i) => (
        <MessageToast key={i} {...e} remove={removeNotification} />
      ))}
    </div>
  );
};

interface MessageToastProps extends Notification {
  remove: (id: string) => void;
}

const MessageToast = ({
  _id,
  user,
  document,
  type,
  createdAt,
  emitter,
  remove,
}: MessageToastProps) => {
  const router = useRouter();
  const goTo = (id: string) => {
    remove(id);

    if (document?.name) router.push(`/channel/${document.slug}`);
    if (document?.data.attributes.properties.name)
      router.push(`/resource/${document.slug}`);
  };

  return (
    <div
      className="w-full p-2 text-gray-900 duration-300 rounded-lg select-none bg-gray-50 lg:p-4 shrink md:max-w-sm hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 hover:shadow-md"
      role="alert"
    >
      <div className="flex items-start justify-between w-full">
        <div className="inline-flex items-center">
          <div className="relative inline-block shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="w-12 h-12 rounded-full"
              src={emitter.photoURL || "/uploads/user/default.png"}
              alt={emitter.fullName}
            />
            <span
              className={classes(
                "absolute bottom-0 right-0 inline-flex items-center justify-center w-6 h-6 rounded-full",
                notifications.find((e) => e.type === type).icon.className
              )}
            >
              {notifications
                .find((e) => e.type === type)
                .icon.component({ className: "w-4 h-4" })}
            </span>
          </div>
          <div className="ml-3 text-sm font-normal">
            <h4 className="text-sm font-semibold text-gray-900 font-marianne dark:text-white">
              {emitter.fullName}
            </h4>
            <div className="text-sm font-normal font-spectral">
              {notifications.find((e) => e.type === type).message}
              {document?.name && (
                <span className="inline-flex items-center ml-1">
                  dans{" "}
                  <a
                    onClick={() => goTo(_id)}
                    className="ml-1 text-blue-500 underline cursor-pointer"
                  >
                    {document.name}
                  </a>
                </span>
              )}
              {document?.data.attributes.properties.name && (
                <span className="inline-flex items-center ml-1">
                  <a
                    onClick={() => goTo(_id)}
                    className="ml-1 text-blue-500 underline cursor-pointer"
                  >
                    {document.data.attributes.properties.name}
                  </a>
                </span>
              )}
            </div>
            <span className="text-xs font-medium text-blue-600 font-spectral dark:text-blue-500">
              {formatDistance(new Date(createdAt), new Date(), { locale: fr })}
            </span>
          </div>
        </div>
        <div className="flex flex-col space-y-3">
          <button
            onClick={() => remove(_id)}
            type="button"
            className="flex items-center justify-center w-6 h-6 text-gray-400 duration-300 bg-gray-200 rounded-lg hover:text-gray-900 focus:ring-2 focus:ring-gray-300 hover:bg-gray-300 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
            data-collapse-toggle="toast-notification"
            aria-label="Fermer"
          >
            <span className="sr-only">Fermer</span>
            <XIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => goTo(_id)}
            className="flex items-center justify-center w-6 h-6 text-gray-400 duration-300 bg-gray-200 rounded-lg hover:text-gray-900 focus:ring-2 focus:ring-gray-300 hover:bg-gray-300 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
            data-collapse-toggle="toast-notification"
            aria-label="Fermer"
          >
            <span className="sr-only">Aller vers</span>
            <ExternalLinkIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
