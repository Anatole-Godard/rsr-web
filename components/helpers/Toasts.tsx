import { ChatAlt2Icon, ChatIcon } from "@heroicons/react/solid";
import { ExternalLinkIcon, XIcon } from "@heroicons/react/outline";
import { fakeUserMin, fakeResource, fakeChannel } from "@utils/faker.dev.js";
import { formatDistance } from "date-fns";
import fr from "date-fns/locale/fr";
import { classes } from "@utils/classes";

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
    message: "vous a envoyé un message",
    icon: {
      className: "bg-blue-100 text-blue-700",
      component: ChatAlt2Icon,
    },
  },
];

export const Toasts = () => {
  return (
    <div className="fixed right-0 z-50 flex flex-col w-full max-w-sm px-2 pt-2 space-y-4 top-20 md:pt-0 md:px-0 md:right-12">
      {[
        {
          user: fakeUserMin(),
          document: {
            ...fakeResource(),
          },
          type: "comment",
          //random date between now and 1 month ago
          createdAt: new Date(
            new Date().getTime() -
              Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)
          ).toISOString(),
        },
        {
          user: fakeUserMin(),
          document: {
            ...fakeChannel()
          },
          type: "message",
          createdAt: new Date(
            new Date().getTime() -
              Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)
          ).toISOString(),
        },
      ].map((e, i) => (
        <MessageToast key={i} {...e} />
      ))}
    </div>
  );
};

const MessageToast = ({ user, document, type, createdAt }) => {
  return (
    <div
      className="w-full p-2 text-gray-900 duration-300 rounded-lg select-none bg-gray-50 lg:p-4 shrink md:max-w-sm hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 hover:shadow-md"
      role="alert"
    >
      <div className="flex items-start justify-between w-full">
        <div className="inline-flex items-center">
          <div className="relative inline-block shrink-0">
            <img
              className="w-12 h-12 rounded-full"
              src={user.photoURL || "/uploads/user/default.png"}
              alt={user.fullName}
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
              {user.fullName}
            </h4>
            <div className="text-sm font-normal font-spectral">
              {notifications.find((e) => e.type === type).message}
            </div>
            <span className="text-xs font-medium text-blue-600 font-spectral dark:text-blue-500">
              {formatDistance(new Date(createdAt), new Date(), { locale: fr })}
            </span>
          </div>
        </div>
        <div className="flex flex-col space-y-3">
          <button
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
