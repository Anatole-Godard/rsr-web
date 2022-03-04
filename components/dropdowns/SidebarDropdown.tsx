/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import {
  ChatIcon,
  HomeIcon,
  LibraryIcon,
} from "@heroicons/react/outline";

import { classes } from "@utils/classes";
import { ChevronDownIcon } from "@heroicons/react/solid";

export const SidebarDropdown = () => {
  return (
    <Menu
      as="div"
      className="relative flex items-center h-full"
      key="sidebar_dropdown-menu"
    >
      {({ open }) => (
        <>
          <Menu.Button key="sidebar_dropdown-btn">
            <div className="flex items-center">
              <span
                className={classes(
                  "inline-flex items-center justify-center w-8 h-8 text-sm duration-300  rounded-full hover:bg-gray-300 active:bg-gray-100  dark:bg-gray-900 dark:active:bg-gray-900  dark:hover:bg-gray-700",
                  open
                    ? "bg-gray-200 dark:bg-gray-700"
                    : "bg-gray-100  dark:bg-gray-800"
                )}
              >
                <div className="flex items-center justify-center w-full h-full align-middle border-none rounded-full select-none ">
                  <ChevronDownIcon
                    key="sidebar_dropdown-icon"
                    className={classes(
                      "w-5 h-5 duration-300 transition",
                      open && "rotate-180"
                    )}
                  />
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
                "bg-white md:origin-top-right fixed md:absolute left-0 md:left-auto md:right-0 mt-6 dark:bg-gray-900 text-base z-50 float-left pb-2 list-none text-left rounded-xl shadow-lg w-fit"
              }
            >
              <>
                <div className="block px-4 pt-3 text-xs text-gray-400 font-marianne">
                  Raccourcis
                </div>
                <div className="inline-flex items-center w-full py-3 ">
                  <Shortcut href="/" icon={HomeIcon} name="Accueil" />

                  <Shortcut href="/channel" icon={ChatIcon} name="Salons" />

                  <Shortcut
                    href="/resource"
                    icon={LibraryIcon}
                    name="Bibliothèque"
                  />
                </div>
              </>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

const Shortcut = ({ href, icon, name }) => (
  <Link href={href}>
    <a className="flex flex-col items-center w-16 h-full mx-4 text-sm text-gray-700 group">
      <div className="flex items-center justify-center w-12 h-12 p-4 duration-300 bg-gray-200 rounded-full group-hover:bg-gray-300 active:bg-gray-100">
        {icon({ className: "w-6 h-6" })}
      </div>
      <span className="mt-2 text-xs font-spectral">{name}</span>
    </a>
  </Link>
);
