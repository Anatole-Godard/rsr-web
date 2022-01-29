/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Menu } from "@headlessui/react";
import { classes } from "@utils/classes";
import { BellIcon as BellOutlineIcon } from "@heroicons/react/outline";
import { BellIcon as BellSolidIcon } from "@heroicons/react/solid";
import { Toasts } from "@components/helpers/Toasts";
import { useAuth } from "@hooks/useAuth";
import { useNotifications } from "@hooks/useNotifications";

export const NotificationsDropdown = () => {
  const { user } = useAuth();
  const { notifications, setNotifications } = useNotifications();
  return user?.data ? (
    <Menu as="div" className="relative flex items-center h-full">
      {({ open }) => (
        <>
          <Menu.Button>
            <div className="flex items-center">
              <span
                className={classes(
                  "inline-flex items-center justify-center w-8 h-8 text-sm duration-300  rounded-full hover:bg-gray-300 active:bg-gray-100  dark:bg-gray-900 dark:active:bg-gray-900  dark:hover:bg-gray-700",
                  open
                    ? "bg-gray-300 dark:bg-gray-700"
                    : "bg-gray-200  dark:bg-gray-800"
                )}
              >
                <div className="flex items-center justify-center w-full h-full text-gray-700 align-middle border-none rounded-full select-none dark:text-gray-300">
                  {notifications.length < 1 ? (
                    <BellOutlineIcon
                      className={classes("w-4 h-4 ", open ? "" : "")}
                    />
                  ) : (
                    <BellSolidIcon
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
          <Menu.Items>
            <Toasts />
          </Menu.Items>
        </>
      )}
    </Menu>
  ) : null;
};
