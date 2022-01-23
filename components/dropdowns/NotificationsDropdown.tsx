/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Menu, Transition } from "@headlessui/react";
import { classes } from "@utils/classes";
import { BellIcon } from "@heroicons/react/outline";
import { Toasts } from "@components/helpers/Toasts";

export const NotificationsDropdown = () => {
  return (
    <Menu as="div" className="relative flex items-center h-full">
      {({ open }) => (
        <>
          <Menu.Button>
            <div className="flex items-center">
              <span
                className={classes(
                  "inline-flex items-center justify-center w-8 h-8 text-sm duration-300  rounded-full hover:bg-gray-300 active:bg-gray-50",
                  open ? "bg-gray-200" : "bg-gray-100"
                )}
              >
                <div className="flex items-center justify-center w-full h-full align-middle border-none rounded-full select-none ">
                  <BellIcon className="w-4 h-4 text-gray-600" />
                </div>
              </span>
            </div>
          </Menu.Button>
          <Menu.Items static>
            <Transition
              show={open}
              enter="transform transition duration-100 ease-in"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transform transition duration-75 ease-out"
              leaveFrom="opacity-100 "
              leaveTo="opacity-0 "
            >
              <Toasts />
            </Transition>
          </Menu.Items>
        </>
      )}
    </Menu>
  );
};
