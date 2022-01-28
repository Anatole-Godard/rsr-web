/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Menu } from "@headlessui/react";
import { classes } from "@utils/classes";
import { BellIcon } from "@heroicons/react/outline";
import { Toasts } from "@components/helpers/Toasts";
import { useAuth } from "@hooks/useAuth";

export const NotificationsDropdown = () => {
  const { user } = useAuth();
  return user?.data ? (
    <Menu as="div" className="relative flex items-center h-full">
      {({ open }) => (
        <>
          <Menu.Button>
            <div className="flex items-center">
              <span
                className={classes(
                  "inline-flex items-center justify-center w-8 h-8 text-sm duration-300  rounded-full hover:bg-gray-300 active:bg-gray-100  dark:bg-gray-900 dark:active:bg-gray-900  dark:hover:bg-gray-700",
                    open ? "bg-gray-300 dark:bg-gray-700" : "bg-gray-200  dark:bg-gray-800"
                )}
              >
                <div className="flex items-center justify-center w-full h-full align-middle border-none rounded-full select-none ">
                  <BellIcon
                    className={classes("w-4 h-4 ", open ? "" : "")}
                  />
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
